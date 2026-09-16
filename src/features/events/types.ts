// EventBlueprint — GET /events. Global: every event carries its own place and country.
export interface FabrixEvent {
  id: string;
  title: string;
  description: string | null;
  /** ISO 8601. The API orders by it: soonest first. */
  happens_at: string;
  address: string | null;
  country_code: string | null;
  lon: number | null;
  lat: number | null;
  online: boolean;
  online_url: string | null;
  image_url: string | null;
  /** Who may edit or delete it (its creator, or a FABRIX admin). */
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
  community: { id: string; name: string; slug: string } | null;
}

export const RSVP_STATUSES = ["going", "maybe", "not_going"] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const RSVP_LABELS: Record<RsvpStatus, string> = {
  going: "Going",
  maybe: "Maybe",
  not_going: "Can't go",
};

// EventParticipantBlueprint — GET /events/:id/participants.
export interface EventParticipant {
  id: string;
  status: RsvpStatus;
  rsvp_at: string;
  created_at: string;
  user: { id: string; name: string; email: string; image_url: string | null };
}

/** What POST/PATCH /events accept. */
export interface EventPayload {
  title: string;
  description: string | null;
  happens_at: string;
  online: boolean;
  online_url: string | null;
  address: string | null;
  country_code: string | null;
  lon: number | null;
  lat: number | null;
  image_url?: string | null;
}
