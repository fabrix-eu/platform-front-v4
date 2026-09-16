import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/lib/auth";

export interface UpdateMePayload {
  name?: string;
  email?: string;
  image_url?: string | null;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

// PATCH /me answers `{ message, data }` — two keys, so the client hands it back
// whole. The API asks for current_password whenever email or password changes,
// and a new email sends a fresh verification mail (the account reverts to
// unverified until it is followed).
export const updateMe = (user: UpdateMePayload): Promise<{ message: string; data: User }> =>
  api.patch<{ message: string; data: User }>("/me", { user });

export const deleteMe = (): Promise<{ message: string }> => api.delete<{ message: string }>("/me");

export interface NotificationPreference {
  notification_type: string;
  enabled: boolean;
  in_app: boolean;
  email: boolean;
  /** Types that carry a responsibility: the API refuses to switch them off (422). */
  mandatory: boolean;
}

export const PREFERENCES_KEY = ["notification_preferences"];

// GET /notification_preferences → a bare array, no envelope.
export const preferencesQueryOptions = queryOptions({
  queryKey: PREFERENCES_KEY,
  queryFn: () => api.get<NotificationPreference[]>("/notification_preferences"),
});

// The path is a collection one — there is no /notification_preferences/:id.
export const updatePreference = (
  notification_preference: Omit<NotificationPreference, "mandatory">,
): Promise<NotificationPreference> =>
  api.patch<NotificationPreference>("/notification_preferences/update", { notification_preference });

/**
 * The API still lists preferences for retired features (communities,
 * challenges). Only the types below exist in the product, and anything absent
 * from this map is hidden rather than shown under its raw key.
 */
export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  join_request_received: "Join request received",
  join_request_accepted: "Join request accepted",
  join_request_declined: "Join request declined",
  organization_member_joined: "New member joined your organisation",
  organization_invitation_accepted: "Invitation accepted",
  organization_claimed: "Organisation claimed",
  event_created: "New event",
  nearby_organization_created: "New organisation near you",
};
