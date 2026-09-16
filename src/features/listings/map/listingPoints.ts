import type { Listing } from "../types";
import { LISTING_TYPES } from "../taxonomy";

// A map style needs real colour values, not classes — so the fx tokens are read from
// the stylesheet rather than copied here. One source of truth, still.
function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** The colour of each listing type, matching its badge. */
export function typeColors(): Record<string, string> {
  return {
    material: token("--color-fx-green", "#2a9d63"),
    capacity: token("--color-fx-amber", "#c07d15"),
    service: token("--color-fx-teal", "#1d9c99"),
    product: token("--color-fx-rose", "#cb4a86"),
    distribution: token("--color-fx-indigo", "#554cc4"),
  };
}

export const mapColors = () => ({
  types: typeColors(),
  other: token("--color-fx-muted", "#6f6f7b"),
  cluster: token("--color-fx-emphasis", "#6c4cf1"),
  clusterInk: token("--color-fx-emphasis-ink", "#ffffff"),
  paper: token("--color-fx-paper", "#ffffff"),
  ring: token("--color-fx-emphasis", "#6c4cf1"),
});

/** `match` expression colouring a point by its listing type. */
export function colorByType(): unknown[] {
  const colors = typeColors();
  return ["match", ["get", "type"], ...LISTING_TYPES.flatMap((type) => [type, colors[type]]), token("--color-fx-muted", "#6f6f7b")];
}

export interface ListingPoint {
  listing: Listing;
  lon: number;
  lat: number;
}

/** Only the listings whose organisation has an address on the map. */
export function listingPoints(listings: Listing[]): ListingPoint[] {
  return listings.flatMap((listing) => {
    const { lon, lat } = listing.organization;
    return lon == null || lat == null ? [] : [{ listing, lon, lat }];
  });
}

export function pointsToGeoJSON(points: ListingPoint[]) {
  return {
    type: "FeatureCollection" as const,
    features: points.map(({ listing, lon, lat }) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [lon, lat] },
      properties: { id: listing.id, type: listing.listing_type },
    })),
  };
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
