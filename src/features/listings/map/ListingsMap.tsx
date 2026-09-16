import { useEffect, useMemo, useRef, useState } from "react";
import {
  GeoJSONSource,
  LngLatBounds,
  Map as MapLibreMap,
  NavigationControl,
  type ExpressionSpecification,
  type MapLayerMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ResolvedLocation } from "@/features/explore/location";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Listing } from "../types";
import { circlePolygon, colorByType, listingPoints, mapColors, pointsToGeoJSON } from "./listingPoints";
import { MapLegend, MapSelection } from "./MapOverlays";

// Carto Positron: a quiet grey basemap, free and keyless, so the coloured pins are
// the only thing with weight on the page.
const STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const SOURCE = "listings";
const AREA = "filter-area";

export function ListingsMap({ listings, location }: { listings: Listing[]; location: ResolvedLocation }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  // Ephemeral: the pin someone clicked.
  const [selected, setSelected] = useState<Listing | null>(null);

  const points = useMemo(() => listingPoints(listings), [listings]);
  const byId = useMemo(() => new Map(points.map((point) => [point.listing.id, point.listing])), [points]);

  // The map itself, once.
  useEffect(() => {
    if (!container.current || map.current) return;
    const instance = new MapLibreMap({
      container: container.current,
      style: STYLE,
      center: [4.9, 52.1],
      zoom: 4,
      attributionControl: { compact: true },
    });
    map.current = instance;
    instance.addControl(new NavigationControl({ showCompass: false }), "top-right");
    instance.on("load", () => setReady(true));
    // A basemap that fails (no WebGL, tiles refused) would otherwise fail in silence.
    instance.on("error", (event) => console.error("[map]", event.error?.message ?? event));
    if (import.meta.env.DEV) (window as unknown as { __fxMap?: MapLibreMap }).__fxMap = instance;

    return () => {
      instance.remove();
      map.current = null;
      setReady(false);
    };
  }, []);

  // The points, their clusters, and the filter's circle.
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;
    const colors = mapColors();
    const data = pointsToGeoJSON(points);

    const source = instance.getSource(SOURCE) as GeoJSONSource | undefined;
    if (source) {
      source.setData(data);
    } else {
      instance.addSource(SOURCE, { type: "geojson", data, cluster: true, clusterRadius: 48, clusterMaxZoom: 12 });
      instance.addSource(AREA, { type: "geojson", data: circlePolygon([0, 0], 0) });

      instance.addLayer({ id: "area-fill", type: "fill", source: AREA, paint: { "fill-color": colors.ring, "fill-opacity": 0.06 } });
      instance.addLayer({
        id: "area-line",
        type: "line",
        source: AREA,
        paint: { "line-color": colors.ring, "line-opacity": 0.35, "line-width": 1.5, "line-dasharray": [2, 2] },
      });
      instance.addLayer({
        id: "clusters",
        type: "circle",
        source: SOURCE,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": colors.cluster,
          "circle-radius": ["step", ["get", "point_count"], 16, 10, 22, 50, 28],
          "circle-stroke-width": 3,
          "circle-stroke-color": colors.paper,
        },
      });
      instance.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: SOURCE,
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-font": ["Open Sans Bold"], "text-size": 13 },
        paint: { "text-color": colors.clusterInk },
      });
      instance.addLayer({
        id: "points",
        type: "circle",
        source: SOURCE,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": colorByType() as ExpressionSpecification,
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 5, 10, 8, 14, 11],
          "circle-stroke-width": 2,
          "circle-stroke-color": colors.paper,
        },
      });

      instance.on("click", "points", (event: MapLayerMouseEvent) => {
        const id = event.features?.[0]?.properties?.id as string | undefined;
        if (id) setSelected(byId.get(id) ?? null);
      });
      instance.on("click", "clusters", (event: MapLayerMouseEvent) => {
        const feature = event.features?.[0];
        const clusterId = feature?.properties?.cluster_id;
        if (clusterId == null || feature?.geometry.type !== "Point") return;
        const center = feature.geometry.coordinates as [number, number];
        const clustered = instance.getSource(SOURCE) as GeoJSONSource;
        void clustered.getClusterExpansionZoom(clusterId).then((zoom: number) => instance.easeTo({ center, zoom }));
      });
      for (const layer of ["points", "clusters"]) {
        instance.on("mouseenter", layer, () => {
          instance.getCanvas().style.cursor = "pointer";
        });
        instance.on("mouseleave", layer, () => {
          instance.getCanvas().style.cursor = "";
        });
      }
    }

    const area = instance.getSource(AREA) as GeoJSONSource | undefined;
    area?.setData(
      location.active && location.lon != null && location.lat != null
        ? circlePolygon([location.lon, location.lat], location.radius)
        : circlePolygon([0, 0], 0),
    );
  }, [ready, points, byId, location]);

  // Frame what is being shown: the filter's area, or all the pins.
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;

    const framed: [number, number][] =
      location.active && location.lon != null && location.lat != null
        ? (circlePolygon([location.lon, location.lat], location.radius).features[0].geometry.coordinates[0] as [number, number][])
        : points.map((point) => [point.lon, point.lat]);
    if (framed.length === 0) return;

    const bounds = framed.reduce((box, coord) => box.extend(coord), new LngLatBounds(framed[0], framed[0]));
    instance.fitBounds(bounds, { padding: 56, maxZoom: location.active ? 14 : 12, duration: 600 });
  }, [ready, points, location]);

  return (
    <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-fx-lg border border-fx-line bg-fx-panel">
      <div ref={container} className="size-full" data-testid="listings-map" data-ready={ready} />
      {points.length > 0 && <MapLegend />}
      {selected && <MapSelection listing={selected} onClose={() => setSelected(null)} />}
      {points.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-fx-paper/80 p-6">
          <EmptyState
            title="Nothing to show on the map"
            description="These listings have no address yet — their organisations have not placed themselves on the map."
          />
        </div>
      )}
    </div>
  );
}
