import type { User } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";

// The "near + radius" filter shared by the explore pages (marketplace, events, directory).
// It defaults to the current organisation's address: what is close to me first.

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
