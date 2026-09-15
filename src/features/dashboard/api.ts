import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { api, type Paginated } from "@/lib/api";
import type { MeOrganization } from "@/lib/auth";

// ActivityBlueprint — GET /feed?organization_id= : the listings and events of the
// organisation and of the networks it belongs to.
export interface FeedActivity {
  id: string;
  action: string;
  created_at: string;
  owner: { id: string; name: string; image_url: string | null };
  organization: { id: string; name: string; slug: string } | null;
  trackable: { type: string; id?: string; title?: string } | null;
}

export const orgFeedQueryOptions = (organizationId: string) =>
  infiniteQueryOptions({
    queryKey: ["feed", "organization", organizationId],
    queryFn: ({ pageParam }) => api.get<Paginated<FeedActivity>>("/feed", { organization_id: organizationId, page: pageParam, per_page: 10 }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.current_page < last.meta.total_pages ? last.meta.current_page + 1 : undefined),
  });

interface OrgRef {
  id: string;
  name: string;
}

export interface PendingActions {
  /** Join requests on organisations you own, waiting for you. */
  incoming: { org: MeOrganization; count: number }[];
  /** Invitations you received (to join, or to claim an organisation). */
  invitations: { id: string; invitation_type: string; organization: OrgRef }[];
  /** Claims you sent, waiting for the FABRIX team. */
  claims: { id: string; organization: OrgRef }[];
  /** Your requests to join an organisation, waiting for its owners. */
  requests: { id: string; organization: OrgRef }[];
}

type WithStatus = { id: string; status: string; organization: OrgRef };

export const pendingActionsQueryOptions = (ownedOrgs: MeOrganization[]) =>
  queryOptions({
    queryKey: ["pending-actions", ownedOrgs.map((o) => o.organization_id)],
    queryFn: async (): Promise<PendingActions> => {
      const [[claims, requests, invitations], incoming] = await Promise.all([
        Promise.all([
          api.get<WithStatus[]>("/my/organization_claims"),
          api.get<WithStatus[]>("/my/join_requests"),
          api.get<(PendingActions["invitations"][number] & { expired: boolean })[]>("/my/invitations"),
        ]),
        Promise.all(ownedOrgs.map((org) => api.get<{ status: string }[]>(`/organizations/${org.organization_id}/join_requests`))),
      ]);
      return {
        incoming: ownedOrgs
          .map((org, i) => ({ org, count: incoming[i].filter((r) => r.status === "pending").length }))
          .filter((entry) => entry.count > 0),
        invitations: invitations.filter((i) => !i.expired),
        claims: claims.filter((c) => c.status === "pending"),
        requests: requests.filter((r) => r.status === "pending"),
      };
    },
  });
