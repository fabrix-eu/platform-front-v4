// A map style needs real colour values, not classes — so the fx tokens are read from
// the stylesheet rather than copied here. One source of truth, still.
export function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** A circle on the sphere, to show the "within N km" filter. */
export function circlePolygon(center: [number, number], radiusKm: number, steps = 96) {
  const [lonDeg, latDeg] = center;
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const d = radiusKm / 6371;

  const coordinates: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (i / steps) * 2 * Math.PI;
    const pointLat = Math.asin(Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(bearing));
    const pointLon = lon + Math.atan2(Math.sin(bearing) * Math.sin(d) * Math.cos(lat), Math.cos(d) - Math.sin(lat) * Math.sin(pointLat));
    coordinates.push([(pointLon * 180) / Math.PI, (pointLat * 180) / Math.PI]);
  }

  return {
    type: "FeatureCollection" as const,
    features: [{ type: "Feature" as const, geometry: { type: "Polygon" as const, coordinates: [coordinates] }, properties: {} }],
  };
}
