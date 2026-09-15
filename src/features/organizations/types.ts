/** OrganizationBlueprint :basic view — what /organizations/search returns. */
export interface OrganizationSummary {
  id: string;
  name: string;
  slug?: string;
  kind: string | null;
  address: string | null;
  image_url: string | null;
  lon: number | null;
  lat: number | null;
  /** Someone manages it: it cannot be claimed, only joined. */
  claimed: boolean;
}

export interface OrganizationPhoto {
  id: string;
  url: string;
  caption: string | null;
  position: number;
}

export interface OrganizationRelation {
  id: string;
  from_organization_id: string;
  to_organization_id: string;
  relation_type: string;
  description: string | null;
}

/** GET /organizations/:id — OrganizationBlueprint :extended view (public, no auth). */
export interface OrganizationProfile {
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
  cover_url: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  instagram: string | null;
  specialties: string[];
  claimed: boolean;
  relations_count: number;
  sector: string | null;
  // Private data: only returned to members and system admins (absent for everyone else).
  number_of_workers?: number | null;
  turnover?: number | null;
  development_stage?: string | null;
  nace_code?: string | null;
  secondary_nace_codes?: string[] | null;
  facility_types?: string[] | null;
  processing_types?: string[] | null;
  relations: OrganizationRelation[];
  /** :basic view, which also carries the default fields (slug, claimed…). */
  related_organizations: (OrganizationSummary & { slug: string })[];
  organization_photos: OrganizationPhoto[];
  networks: { id: string; name: string; slug: string }[];
  profile_completion?: { sections: Record<string, boolean>; completed: number; total: number };
}

/** The fields a new organisation needs (Organization validates name, kind, address, country_code). */
export interface OrganizationDraft {
  name: string;
  kind: string;
  address: string;
  country_code: string;
  lat: number | null;
  lon: number | null;
  specialties: string[];
}
