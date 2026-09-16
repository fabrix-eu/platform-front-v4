import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { GeoJSONSource, LngLatBounds, Map as MapLibreMap, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { ResolvedLocation } from "@/features/explore/location";
import { EmptyState } from "@/components/ui/EmptyState";
import { circlePolygon, token } from "./mapTokens";

// Carto Positron: a quiet grey basemap, free and keyless, so the markers are the only
// thing with weight on the page.
const STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const AREA = "filter-area";
// No clustering: every point keeps its own marker. Only what is in view is drawn, and
// never more than this — enough to stay readable, and to stay smooth.
const MAX_MARKERS = 160;

export interface MapPoint {
  id: string;
  lon: number;
  lat: number;
  /** The dot of the pill: what kind of thing this is. */
  color: string;
  label: string;
}

interface PointsMapProps {
  points: MapPoint[];
  /** Drawn as a circle, and framed, when the "within N km" filter is on. */
  location: ResolvedLocation;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  /** Top-left, over the map. */
  legend?: ReactNode;
  /** The card of whatever is selected. */
  children?: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
}

function pill(point: MapPoint, onClick: () => void): HTMLElement {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "fx-pin";
  el.setAttribute("aria-label", point.label);
  el.innerHTML = `<span class="fx-pin-dot"></span><span class="fx-pin-label"></span>`;
  el.style.setProperty("--fx-pin-color", point.color);
  (el.querySelector(".fx-pin-label") as HTMLElement).textContent = point.label;
  el.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick();
  });
  return el;
}

/** The map the explore pages share: one pill per point, no clusters. */
export function PointsMap({ points, location, selectedId, onSelect, legend, children, emptyTitle, emptyDescription }: PointsMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const [ready, setReady] = useState(false);
  const ring = useMemo(() => token("--color-fx-emphasis", "#6c4cf1"), []);

  const drawMarkers = useCallback(
    (instance: MapLibreMap) => {
      const bounds = instance.getBounds();
      const visible = points.filter((point) => bounds.contains([point.lon, point.lat])).slice(0, MAX_MARKERS);

      for (const marker of markers.current) marker.remove();
      markers.current = visible.map((point) => {
        const el = pill(point, () => onSelect(point.id));
        if (point.id === selectedId) el.classList.add("fx-pin-selected");
        return new Marker({ element: el, anchor: "bottom" }).setLngLat([point.lon, point.lat]).addTo(instance);
      });
    },
    [points, selectedId, onSelect],
  );

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
      for (const marker of markers.current) marker.remove();
      markers.current = [];
      instance.remove();
      map.current = null;
      setReady(false);
    };
  }, []);

  // Markers: on the data, and on every move — like a rental map, not a heat map.
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;
    const redraw = () => drawMarkers(instance);
    redraw();
    instance.on("moveend", redraw);
    return () => {
      instance.off("moveend", redraw);
    };
  }, [ready, drawMarkers]);

  // The circle of the "within N km" filter.
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;
    const data =
      location.active && location.lon != null && location.lat != null
        ? circlePolygon([location.lon, location.lat], location.radius)
        : circlePolygon([0, 0], 0);

    const source = instance.getSource(AREA) as GeoJSONSource | undefined;
    if (source) {
      source.setData(data);
      return;
    }
    instance.addSource(AREA, { type: "geojson", data });
    instance.addLayer({ id: "area-fill", type: "fill", source: AREA, paint: { "fill-color": ring, "fill-opacity": 0.06 } });
    instance.addLayer({
      id: "area-line",
      type: "line",
      source: AREA,
      paint: { "line-color": ring, "line-opacity": 0.35, "line-width": 1.5, "line-dasharray": [2, 2] },
    });
  }, [ready, location, ring]);

  // Frame what is being shown: the filter's area, or all the points.
  useEffect(() => {
    const instance = map.current;
    if (!instance || !ready) return;
    const framed: [number, number][] =
      location.active && location.lon != null && location.lat != null
        ? (circlePolygon([location.lon, location.lat], location.radius).features[0].geometry.coordinates[0] as [number, number][])
        : points.map((point) => [point.lon, point.lat]);
    if (framed.length === 0) return;

    const bounds = framed.reduce((box, coord) => box.extend(coord), new LngLatBounds(framed[0], framed[0]));
    instance.fitBounds(bounds, { padding: 64, maxZoom: location.active ? 13 : 11, duration: 600 });
  }, [ready, points, location]);

  return (
    <div className="relative h-[70vh] min-h-[420px] overflow-hidden rounded-fx-lg border border-fx-line bg-fx-panel">
      <div ref={container} className="size-full" data-testid="points-map" data-ready={ready} />
      {points.length > 0 && legend}
      {children}
      {points.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-fx-paper/80 p-6">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </div>
  );
}
