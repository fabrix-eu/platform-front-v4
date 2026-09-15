import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { OrganizationDraft, OrganizationProfile, OrganizationSummary } from "./types";

/** GET /organizations/:id accepts a UUID or a slug. */
export const organizationProfileQueryOptions = (idOrSlug: string) =>
  queryOptions({
    queryKey: ["organizations", "profile", idOrSlug],
    queryFn: () => api.get<OrganizationProfile>(`/organizations/${idOrSlug}`),
  });

/** PATCH /organizations/:id — members and system admins only (403 otherwise). */
export function updateOrganization(id: string, organization: Partial<Omit<OrganizationProfile, "id">>) {
  return api.patch<OrganizationProfile>(`/organizations/${id}`, { organization });
}

export const organizationSearchQueryOptions = (term: string) =>
  queryOptions({
    queryKey: ["organizations", "search", term],
    queryFn: () => api.get<OrganizationSummary[]>("/organizations/search", { q: term }),
    enabled: term.length >= 2,
    staleTime: 30_000,
  });

/**
 * POST /organizations. `owner_email` decides who owns it:
 * - "" (empty) → the creator becomes its owner;
 * - an email → it stays unclaimed and that person is invited to claim it;
 * - omitted → unclaimed, nobody invited.
 */
export function createOrganization(organization: OrganizationDraft & { owner_email?: string }) {
  return api.post<OrganizationSummary & { slug: string }>("/organizations", { organization });
}

/** Asks to manage an unclaimed organisation; the FABRIX team reviews it. */
export function claimOrganization(organizationId: string, justification: string) {
  return api.post<void>(`/organizations/${organizationId}/claims`, { claim: { justification } });
}
