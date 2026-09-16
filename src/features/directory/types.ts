import type { PageMeta } from "@/lib/api";

// OrganizationBlueprint, default view — what GET /organizations returns for a list.
export interface DirectoryOrganization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  kind: string | null;
  address: string | null;
  country_code: string | null;
  lon: number | null;
  lat: number | null;
  image_url: string | null;
  website: string | null;
  specialties: string[];
  /** Someone manages it: it can be joined, not claimed. */
  claimed: boolean;
  relations_count: number;
}

/** The map payload: the same rows, cut down to what a pin needs. */
export interface DirectoryMapOrganization {
  id: string;
  name: string;
  slug: string;
  kind: string | null;
  address: string | null;
  image_url: string | null;
  lon: number | null;
  lat: number | null;
}

// This endpoint answers with its own envelope, not the usual `{ data, meta }`.
export interface DirectoryPage {
  organizations: DirectoryOrganization[];
  relations: unknown[];
  meta: PageMeta;
}

export interface DirectoryMapPage {
  organizations: DirectoryMapOrganization[];
  relations: unknown[];
  meta: PageMeta;
}
