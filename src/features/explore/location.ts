import type { User } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";

// Where the explore pages look from: the current organisation's address.
// - Marketplace and directory show everything, the closest first; "within N km" is a
//   filter the visitor turns on (`?radius=`).
// - Events are sorted by date, so distance can only be a filter there: they keep
//   "near my organisation" as their default, which `?near=all` clears.

export const RADIUS_OPTIONS = [25, 50, 100, 200, 500];
export const DEFAULT_RADIUS_KM = 100;

export interface MyLocation {
  lon: number;
  lat: number;
  label: string;
}

export interface ResolvedLocation {
  active: boolean;
  lon?: number;
  lat?: number;
  radius: number;
  label?: string;
}

export function myOrgLocation(me: User | undefined): MyLocation | null {
  const org = me && resolveCurrentOrg(me);
  if (!org || org.organization_lon == null || org.organization_lat == null) return null;
  return { lon: org.organization_lon, lat: org.organization_lat, label: org.organization_address || org.organization_name };
}

export function resolveLocation(search: { near?: "all"; radius?: number }, mine: MyLocation | null): ResolvedLocation {
  const radius = search.radius ?? DEFAULT_RADIUS_KM;
  if (search.near === "all" || !mine) return { active: false, radius };
  return { active: true, lon: mine.lon, lat: mine.lat, radius, label: mine.label };
}

/** Marketplace and directory: where "nearest first" is measured from, and the opt-in radius. */
export interface Proximity {
  /** The current organisation, when it has an address: results are sorted from there. */
  origin: MyLocation | null;
  /** The "within N km" filter — off unless a radius is in the URL. */
  area: ResolvedLocation;
}

export function resolveProximity(search: { radius?: number }, mine: MyLocation | null): Proximity {
  if (!mine || search.radius == null) return { origin: mine, area: { active: false, radius: DEFAULT_RADIUS_KM } };
  return { origin: mine, area: { active: true, lon: mine.lon, lat: mine.lat, radius: search.radius, label: mine.label } };
}

/** What follows the count above the results: how distance shaped them. */
export function proximityLabel({ origin, area }: Proximity): string {
  if (area.active) return ` within ${area.radius} km of ${area.label}`;
  return origin ? `, the closest to ${origin.label} first` : "";
}

/** API params of a proximity: the `nearest_first` order, plus the radius filter when it is on. */
export function proximityParams({ origin, area }: Proximity, country?: string): Record<string, string | number | undefined> {
  return {
    ...geoParams(area, country),
    ...(origin ? { "nearest_first[lon]": origin.lon, "nearest_first[lat]": origin.lat } : {}),
  };
}

/** API params for the location filter (has_scope `within_distance` hash + `by_country`). */
export function geoParams(location: ResolvedLocation, country?: string): Record<string, string | number | undefined> {
  return {
    by_country: country,
    ...(location.active
      ? {
          "within_distance[lon]": location.lon,
          "within_distance[lat]": location.lat,
          "within_distance[radius]": location.radius,
        }
      : {}),
  };
}
