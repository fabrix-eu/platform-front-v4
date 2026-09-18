import { useCallback, useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { CityConfig } from "./cities";
import { companyName, type Company, type NaceCategory } from "./api";
import { addClusterLayers, addHexbinLayers, popupHtml, removeCategoryLayers } from "./mapLayers";

// The same quiet grey basemap the explore pages use. Declared here rather than shared
// from PointsMap: that component keeps it private, and this map draws nothing else
// the same way.
const STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

interface CompaniesMapProps {
  city: CityConfig;
  companies: Company[];
  categories: NaceCategory[];
  selected: string[];
  hexbin: boolean;
  loading: boolean;
}

/**
 * Thousands of businesses on one city: either every address, clustered as you zoom, or
 * aggregated into hexagonal cells of density. One source and one set of layers per
 * selected category, so each keeps the colour of its own part of the industry.
 */
export function CompaniesMap({ city, companies, categories, selected, hexbin, loading }: CompaniesMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!container.current || map.current) return;

    const instance = new MapLibreMap({
      container: container.current,
      style: STYLE,
      center: [city.centre.lng, city.centre.lat],
      zoom: city.zoom,
    });
    instance.addControl(new NavigationControl({ showCompass: false }), "top-right");
    instance.on("load", () => setReady(true));
    map.current = instance;

    return () => {
      map.current?.remove();
      map.current = null;
      setReady(false);
    };
  }, [city.centre.lat, city.centre.lng, city.zoom]);

  const draw = useCallback(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    removeCategoryLayers(instance);
    if (selected.length === 0 || companies.length === 0) return;

    const chosen = categories.filter((category) => selected.includes(category.slug));

    for (const category of chosen) {
      const style = { slug: category.slug, name: category.name, color: category.color_hex };
      const mine = companies.filter((company) => company.categories.some((c) => c.slug === category.slug));
      if (mine.length === 0) continue;

      const clickable = hexbin
        ? addHexbinLayers(
            instance,
            companies.map((company) => ({
              latitude: company.latitude,
              longitude: company.longitude,
              name: companyName(company),
              categories: company.categories,
            })),
            style,
            { radius: city.hexbinRadius, referenceLat: city.centre.lat },
          )
        : addClusterLayers(
            instance,
            mine.map((company) => ({
              type: "Feature" as const,
              geometry: { type: "Point" as const, coordinates: [company.longitude, company.latitude] },
              properties: {
                title: companyName(company),
                address: company.address,
                jobs: "jobs" in company ? company.jobs : undefined,
                code: "sbi_code" in company ? company.sbi_code : company.primary_nace_code,
                categoryName: category.name,
                color: category.color_hex,
              },
            })),
            style,
          );

      for (const layer of clickable) {
        instance.on("click", layer, (event) => {
          const feature = event.features?.[0];
          if (!feature || feature.geometry.type !== "Point") return;
          if (feature.properties?.point_count) return; // a cluster: let the zoom handler take it

          const properties = feature.properties ?? {};
          const html = hexbin
            ? popupHtml(String(properties.categoryName), [["Businesses", properties.count], ["Including", properties.names]], style.color)
            : popupHtml(String(properties.title), [
                ["Activity", properties.categoryName],
                ["Address", properties.address],
                ["Jobs", properties.jobs],
                ["NACE", properties.code],
              ], style.color);

          new Popup({ closeButton: true, closeOnClick: true })
            .setLngLat(feature.geometry.coordinates as [number, number])
            .setHTML(html)
            .addTo(instance);
        });

        instance.on("mouseenter", layer, () => { instance.getCanvas().style.cursor = "pointer"; });
        instance.on("mouseleave", layer, () => { instance.getCanvas().style.cursor = ""; });
      }
    }
  }, [categories, city.centre.lat, city.hexbinRadius, companies, hexbin, ready, selected]);

  useEffect(draw, [draw]);

  return (
    <div className="relative size-full">
      <div ref={container} className="size-full" />
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-fx-paper/70">
          <span className="size-6 animate-spin rounded-full border-2 border-fx-emphasis border-t-transparent" />
        </div>
      )}
    </div>
  );
}
