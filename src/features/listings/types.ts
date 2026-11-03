// Mirrors ListingBlueprint (default view) and its :extended view (`images`).

export interface ListingImage {
  id: string;
  image_file_url: string;
  position: number;
}

export interface ListingOrganization {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  value_chain_stages: string[];
  support_roles: string[];
  support_roles_other: string | null;
  address: string | null;
  lon: number | null;
  lat: number | null;
}

export interface Listing {
  id: string;
  listing_type: string;
  /** Offered by its author, or wanted by them. */
  direction: "offering" | "needing";
  /** A single occasion rather than a standing arrangement. */
  one_off: boolean;
  category: string;
  /** What it is, when the category is "other". */
  category_other: string | null;
  title: string;
  description: string;
  status: "active" | "closed";
  quantity: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  thumbnail_url: string | null;
  organization: ListingOrganization;
  images?: ListingImage[];
}

/** What POST/PATCH /listings accept (`organization_id` is ignored on update). */
export interface ListingPayload {
  organization_id?: string;
  listing_type: string;
  direction: string;
  one_off: boolean;
  category: string;
  category_other: string | null;
  title: string;
  description: string;
  quantity: string | null;
  expires_at: string | null;
  status?: string;
}
