import { queryOptions } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import type { OrganizationSummary } from "@/features/organizations/types";

interface Inviter {
  id: string;
  name: string;
  email: string;
}

/** GET /invitations/:token — an invitation to join an organisation as a member. */
export interface MemberInvitation {
  id: string;
  email: string;
  role: "owner" | "admin" | "member";
  expires_at: string;
  expired: boolean;
  organization: OrganizationSummary;
  invited_by: Inviter;
}

/** GET /claim-organization?token= — an invitation to take a profile a partner created. */
export interface ClaimInvitation {
  organization: OrganizationSummary;
  invited_by: Pick<Inviter, "name" | "email">;
  email: string;
  expires_at: string;
}

/** GET /network-invitation/:token — an invitation to co-facilitate a network. */
export interface NetworkInvitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "cancelled";
  expires_at: string;
  network: { id: string; name: string; slug: string };
  invited_by: { name: string } | null;
}

export interface NewAccount {
  name: string;
  password: string;
  password_confirmation: string;
}

interface Session {
  access_token: string;
}

// The three lookups are public: the link is the credential. A wrong or spent token is a
// 404, an expired one a 410 — the pages tell them apart.
export const memberInvitationQueryOptions = (token: string) =>
  queryOptions({ queryKey: ["invitations", "member", token], queryFn: () => api.get<MemberInvitation>(`/invitations/${token}`), retry: false, staleTime: Infinity });

export const claimInvitationQueryOptions = (token: string) =>
  queryOptions({ queryKey: ["invitations", "claim", token], queryFn: () => api.get<ClaimInvitation>("/claim-organization", { token }), retry: false, staleTime: Infinity });

export const networkInvitationQueryOptions = (token: string) =>
  queryOptions({ queryKey: ["invitations", "network", token], queryFn: () => api.get<NetworkInvitation>(`/network-invitation/${token}`), retry: false, staleTime: Infinity });

/** Creates the account (verified, the link proves the address) and joins the organisation. */
export function acceptMemberInvitation(token: string, email: string, account: NewAccount): Promise<Session> {
  return api.post(`/invitations/${token}/accept`, { user: { ...account, email } });
}

/** Signed in: the current user claims. With an account: it is created and claims at once. */
export function acceptClaimInvitation(token: string, account?: NewAccount & { email: string }): Promise<Session | { id: string }> {
  return api.post("/claim-organization/accept", account ? { token, user: account } : { token });
}

/** Signed in only: the current user becomes a facilitator of the network. */
export function acceptNetworkInvitation(token: string): Promise<NetworkInvitation> {
  return api.post(`/network-invitation/${token}/accept`, {});
}

export type InvitationProblem = "expired" | "invalid" | "other";

export const invitationProblem = (error: unknown): InvitationProblem =>
  error instanceof ApiError ? (error.status === 410 ? "expired" : error.status === 404 ? "invalid" : "other") : "other";
