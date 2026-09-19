import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { api, type Paginated } from "@/lib/api";

/**
 * What GET /admin/organizations returns — OrganizationBlueprint's *default* view.
 *
 * Not the extended one: workers and turnover are private and live there, and that
 * default view is also what the public endpoint serves. The server can sort on them
 * all the same, which is why the table only offers the columns it can actually show.
 */
export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  kind: string | null;
  address: string | null;
  country_code: string | null;
  image_url: string | null;
  claimed: boolean;
  relations_count: number;
  created_at: string;
}

type Params = Record<string, string | number | undefined>;

interface AdminPerson {
  id: string;
  name: string | null;
  email?: string | null;
  image_url?: string | null;
}

export interface AdminNetwork {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  organizations_count: number | null;
  center_address: string | null;
  radius_km: number | null;
  created_at: string;
  created_by: AdminPerson | null;
  organization: { id: string; name: string; slug: string } | null;
}

export type ClaimStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface AdminClaim {
  id: string;
  status: ClaimStatus;
  justification: string;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  organization: { id: string; name: string; slug: string } | null;
  claimant: AdminPerson | null;
  reviewed_by: AdminPerson | null;
}

export interface AdminFeedback {
  id: string;
  category: "bug" | "feature" | "question";
  message: string;
  screenshot_url: string | null;
  created_at: string;
  user: AdminPerson | null;
}

// Paging a worked-through list: the table should not blink back to a skeleton between
// pages, it should stay legible while the next one arrives.
const list = <T,>(key: string, path: string, params: Params) =>
  queryOptions({
    queryKey: ["admin", key, params],
    queryFn: () => api.get<Paginated<T>>(path, params),
    placeholderData: keepPreviousData,
  });

export const adminOrganizationsQueryOptions = (params: Params) =>
  list<AdminOrganization>("organizations", "/admin/organizations", params);

export const adminNetworksQueryOptions = (params: Params) =>
  list<AdminNetwork>("networks", "/admin/networks", params);

export const adminClaimsQueryOptions = (params: Params) =>
  list<AdminClaim>("claims", "/admin/organization_claims", params);

export const adminFeedbacksQueryOptions = (params: Params) =>
  list<AdminFeedback>("feedbacks", "/admin/feedbacks", params);

/** Approving a claim makes the claimant an owner — the API refuses anything but a pending one. */
export const approveClaim = (id: string) => api.post<void>(`/admin/organization_claims/${id}/approve`);

/** Rejecting one demands a reason: a refusal with nothing behind it is not an answer. */
export const rejectClaim = (id: string, rejection_reason: string) =>
  api.post<void>(`/admin/organization_claims/${id}/reject`, { rejection_reason });
