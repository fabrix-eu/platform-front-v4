import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { OrganizationDraft, OrganizationSummary } from "./types";

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
