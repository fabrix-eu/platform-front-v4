import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

// OrganizationUserBlueprint :with_user — GET /organizations/:id/users (members only).
export interface TeamMember {
  id: string;
  role: "owner" | "member";
  status: string;
  created_at: string;
  user: { id: string; name: string; email: string; image_url: string | null };
}

// OrganizationInvitationBlueprint — GET /organizations/:id/invitations (owners only).
export interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  invitation_type: string;
  expires_at: string;
  created_at: string;
  expired: boolean;
}

export const teamMembersQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["organizations", organizationId, "team", "members"],
    queryFn: () => api.get<TeamMember[]>(`/organizations/${organizationId}/users`),
  });

export const teamInvitationsQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["organizations", organizationId, "team", "invitations"],
    queryFn: () => api.get<TeamInvitation[]>(`/organizations/${organizationId}/invitations`),
  });

/** An existing account is added at once; anyone else gets an email invitation. */
export function inviteColleague(organizationId: string, email: string) {
  return api.post<{ message: string }>(`/organizations/${organizationId}/invitations`, { invitation: { email, role: "member" } });
}

// Owners only. The API refuses to remove or demote the last owner.
export function updateMemberRole(organizationId: string, membershipId: string, role: TeamMember["role"]) {
  return api.patch<TeamMember>(`/organizations/${organizationId}/users/${membershipId}`, { organization_user: { role } });
}

export function removeMember(organizationId: string, membershipId: string) {
  return api.delete<{ message: string }>(`/organizations/${organizationId}/users/${membershipId}`);
}

/** Sends the email again and extends the expiry. */
export function resendInvitation(organizationId: string, invitationId: string) {
  return api.post<TeamInvitation>(`/organizations/${organizationId}/invitations/${invitationId}/resend`);
}

export function cancelInvitation(organizationId: string, invitationId: string) {
  return api.delete<{ message: string }>(`/organizations/${organizationId}/invitations/${invitationId}`);
}

// The API has two roles. A member can already edit the profile and listings — the
// prototype's Manager; its read-only "Team" role does not exist yet.
export const roleLabel = (role: string) => (role === "owner" ? "Owner" : "Manager");
