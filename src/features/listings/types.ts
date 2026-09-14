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
  kind: string | null;
  address: string | null;
  lon: number | null;
  lat: number | null;
}

export interface Listing {
  id: string;
  listing_type: string;
  category: string;
  subcategory: string | null;
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
  category: string;
  subcategory: string | null;
  title: string;
  description: string;
  quantity: string | null;
  expires_at: string | null;
  status?: string;
}
