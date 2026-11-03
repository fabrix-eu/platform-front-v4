import { token } from "@/features/explore/map/mapTokens";
import type { Listing } from "../types";

/** The colour of each listing type, matching its badge. */
export function typeColors(): Record<string, string> {
  return {
    materials: token("--color-fx-amber", "#c07d15"),
    capacities: token("--color-fx-emphasis", "#6c4cf1"),
    services: token("--color-fx-teal", "#1d9c99"),
    products: token("--color-fx-rose", "#cb4a86"),
    logistics: token("--color-fx-ink2", "#4b4b57"),
  };
}

export const otherColor = () => token("--color-fx-muted", "#6f6f7b");

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
