import type { Map as MapLibreMap } from "maplibre-gl";
import { aggregateToHexbins, type HexPoint } from "./hexbin";

/** Everything this module adds is prefixed, so cleaning up is a name test. */
export const LAYER_PREFIX = "fx-data-";

const escapeHtml = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A popup, built from values that come from a public register — escaped all the same. */
export function popupHtml(title: string, rows: [string, string | number | undefined][], color: string): string {
  const lines = rows
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([label, value]) => `<p style="margin:2px 0"><b>${escapeHtml(label)}:</b> ${escapeHtml(value)}</p>`)
    .join("");

  return `<div style="padding:8px;min-width:190px;font-family:inherit">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
      <span style="width:10px;height:10px;border-radius:3px;background:${escapeHtml(color)}"></span>
      <strong style="font-size:13px">${escapeHtml(title)}</strong>
    </div>
    <div style="font-size:12px;opacity:.75">${lines}</div>
  </div>`;
}

export function removeCategoryLayers(map: MapLibreMap): void {
  const style = map.getStyle();
  style.layers?.forEach((layer) => {
    if (layer.id.startsWith(LAYER_PREFIX) && map.getLayer(layer.id)) map.removeLayer(layer.id);
  });
  Object.keys(style.sources ?? {}).forEach((id) => {
    if (id.startsWith(LAYER_PREFIX) && map.getSource(id)) map.removeSource(id);
  });
}

interface CategoryStyle {
  slug: string;
  name: string;
  color: string;
}

/** Density: one circle per hexagonal cell, sized by how many businesses it holds. */
export function addHexbinLayers(
  map: MapLibreMap,
  points: HexPoint[],
  category: CategoryStyle,
  options: { radius: number; referenceLat: number },
): string[] {
  const cells = aggregateToHexbins(points, { ...options, categorySlug: category.slug });
  if (cells.length === 0) return [];

  const id = `${LAYER_PREFIX}hex-${category.slug}`;
  map.addSource(id, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: cells.map((cell) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [cell.lng, cell.lat] },
        properties: { count: cell.count, names: cell.names.join(", "), categoryName: category.name, color: category.color },
      })),
    },
  });

  map.addLayer({
    id,
    type: "circle",
    source: id,
    paint: {
      "circle-color": category.color,
      // Square root, so the area reads as the count rather than the radius doing.
      "circle-radius": ["+", 10, ["*", ["sqrt", ["get", "count"]], 2]],
      "circle-opacity": 0.7,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.addLayer({
    id: `${id}-count`,
    type: "symbol",
    source: id,
    layout: { "text-field": ["get", "count"], "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"], "text-size": 11 },
    paint: { "text-color": "#ffffff" },
  });

  return [id];
}

/** Every business at its own address, grouped by the map while it is zoomed out. */
export function addClusterLayers(
  map: MapLibreMap,
  features: GeoJSON.Feature<GeoJSON.Point>[],
  category: CategoryStyle,
): string[] {
  if (features.length === 0) return [];

  const id = `${LAYER_PREFIX}pts-${category.slug}`;
  map.addSource(id, {
    type: "geojson",
    data: { type: "FeatureCollection", features },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: `${id}-cluster`,
    type: "circle",
    source: id,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": category.color,
      "circle-radius": ["step", ["get", "point_count"], 15, 10, 20, 50, 25, 100, 30, 500, 40],
      "circle-opacity": 0.8,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.addLayer({
    id: `${id}-cluster-count`,
    type: "symbol",
    source: id,
    filter: ["has", "point_count"],
    layout: { "text-field": "{point_count_abbreviated}", "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"], "text-size": 12 },
    paint: { "text-color": "#ffffff" },
  });

  map.addLayer({
    id: `${id}-point`,
    type: "circle",
    source: id,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": category.color,
      "circle-radius": 8,
      "circle-opacity": 0.9,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });

  return [`${id}-cluster`, `${id}-point`];
}
