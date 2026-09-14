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
