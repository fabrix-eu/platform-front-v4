/** A facilitator network: the shared CRM over the organisations it follows. */
export interface Network {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  organizations_count: number;
  center_address: string | null;
  center_lat: number | null;
  center_lon: number | null;
  radius_km: number | null;
  organization: { id: string; name: string; slug: string | null; image_url: string | null } | null;
  /** The API refuses to remove them, and refuses to remove the last member. */
  created_by?: { id: string; name: string } | null;
}

export interface NetworkOrganizationOrg {
  id: string;
  name: string;
  slug: string | null;
  kind: string | null;
  address: string | null;
  country_code: string | null;
  image_url: string | null;
  lon: number | null;
  lat: number | null;
  description?: string | null;
  specialties?: string[];
}

/** Someone from the followed organisation who is on the platform. */
export interface OrgPerson {
  id: string;
  role: string;
  user: { id: string; name: string; email: string; image_url: string | null };
}

export const CONTACT_KINDS: Record<string, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  visit: "Visit",
  other: "Other",
};

/** One logged interaction with the organisation. */
export interface ContactPoint {
  id: string;
  kind: string;
  occurred_at: string;
  summary: string;
  created_at: string;
  author: { id: string; name: string; image_url: string | null } | null;
}

/** The CRM record: what this network knows about an organisation it follows. */
export interface NetworkOrganization {
  id: string;
  organization_id: string;
  status: string;
  notes: string | null;
  economic_health: string;
  environmental_score: string;
  specialization: string | null;
  annual_turnover: number | string | null;
  number_of_employees: number | null;
  growth_rate: number | string | null;
  needs: Record<string, unknown>;
  added_at: string | null;
  organization: NetworkOrganizationOrg;
  added_by: { id: string; name: string } | null;
}

export interface NetworkTask {
  id: string;
  title: string;
  notes: string | null;
  due_on: string | null;
  /** Null while the task is open — the API has no `done` boolean of its own. */
  done_at: string | null;
  network_organization_id: string | null;
  created_at: string;
  created_by: { id: string; name: string } | null;
  organization: { id: string; name: string; slug: string | null; image_url: string | null } | null;
}

export interface NetworkMember {
  id: string;
  role: string;
  active: boolean;
  created_at: string;
  user: { id: string; name: string; email: string; image_url: string | null };
}

/** A colleague of the central organisation without facilitator access yet. */
export interface NetworkCandidate {
  id: string;
  name: string;
  email: string;
  image_url: string | null;
}

export interface NetworkInvitation {
  id: string;
  email: string;
  status: string;
  expires_at: string;
  created_at: string;
  invited_by?: { id: string; name: string };
}

export const HEALTH_LABELS: Record<string, string> = {
  unknown: "Unknown",
  excellent: "Excellent",
  good: "Good",
  warning: "Warning",
  critical: "Critical",
};

export const HEALTH_TONES: Record<string, "green" | "amber" | "rose" | "slate"> = {
  unknown: "slate",
  excellent: "green",
  good: "green",
  warning: "amber",
  critical: "rose",
};
