import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { api, type Paginated } from "@/lib/api";
import { uploadFile } from "@/lib/upload";
import type { Listing, ListingImage, ListingPayload } from "./types";

/** Query params of GET /listings (has_scope names, `within_distance[...]` for the radius). */
export type ListingFilters = Record<string, string | number | undefined>;

export const LISTINGS_KEY = ["listings"];

export const listingsInfiniteQueryOptions = (filters: ListingFilters) =>
  infiniteQueryOptions({
    queryKey: ["listings", "list", filters],
    queryFn: ({ pageParam }) => api.get<Paginated<Listing>>("/listings", { ...filters, page: pageParam, per_page: 24 }),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.next_page ?? undefined,
  });

/** The map needs them all at once, not page by page: `view=map` skips pagination (2000 max). */
export const listingsMapQueryOptions = (filters: ListingFilters) =>
  queryOptions({
    queryKey: ["listings", "map", filters],
    queryFn: () => api.get<Paginated<Listing>>("/listings", { ...filters, view: "map" }),
  });

export const listingQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["listings", "detail", id],
    queryFn: () => api.get<Listing>(`/listings/${id}`),
  });

export const createListing = (listing: ListingPayload) => api.post<Listing>("/listings", { listing });

export const updateListing = (id: string, listing: ListingPayload) => api.patch<Listing>(`/listings/${id}`, { listing });

export const deleteListing = (id: string) => api.delete<void>(`/listings/${id}`);

export const removeListingImage = (listingId: string, imageId: string) =>
  api.delete<void>(`/listings/${listingId}/listing_images/${imageId}`);

/** Uploads each file then attaches it; keeps going on a failure. Returns how many failed. */
export async function uploadListingImages(listingId: string, files: File[]): Promise<number> {
  let failed = 0;
  for (const file of files) {
    try {
      const url = await uploadFile(file, "Listing", listingId);
      await api.post<ListingImage>(`/listings/${listingId}/listing_images`, { listing_image: { image_file_url: url } });
    } catch {
      failed += 1;
    }
  }
  return failed;
}
