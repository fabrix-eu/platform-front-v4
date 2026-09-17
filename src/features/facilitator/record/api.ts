import { queryOptions } from "@tanstack/react-query";
import { api, type Paginated } from "@/lib/api";
import { networkKey } from "../api";
import type { ContactPoint, NetworkOrganization, OrgPerson } from "../types";

export const recordKey = (slug: string, id: string) => [...networkKey(slug), "record", id];

/** GET /networks/:slug/organizations/:id — the CRM record, not the public profile. */
export const networkOrganizationQueryOptions = (slug: string, id: string) =>
  queryOptions({
    queryKey: recordKey(slug, id),
    queryFn: () => api.get<NetworkOrganization>(`/networks/${slug}/organizations/${id}`),
  });

/** The fields only this network sees: health, notes, needs, business figures. */
export type RecordPatch = Partial<{
  status: string;
  notes: string;
  economic_health: string;
  environmental_score: string;
  specialization: string;
  annual_turnover: number | null;
  number_of_employees: number | null;
  growth_rate: number | null;
  needs: Record<string, unknown>;
}>;

export const updateRecord = (slug: string, id: string, network_organization: RecordPatch): Promise<NetworkOrganization> =>
  api.patch<NetworkOrganization>(`/networks/${slug}/organizations/${id}`, { network_organization });

/** Unfollowing deletes the CRM data with it — notes, needs and interactions. */
export const unfollowOrganization = (slug: string, id: string): Promise<void> =>
  api.delete<void>(`/networks/${slug}/organizations/${id}`);

/** The people of the followed organisation who are on the platform. */
export const orgPeopleQueryOptions = (slug: string, id: string) =>
  queryOptions({
    queryKey: [...recordKey(slug, id), "people"],
    queryFn: () => api.get<OrgPerson[]>(`/networks/${slug}/organizations/${id}/people`),
  });

export const contactPointsQueryOptions = (slug: string, id: string) =>
  queryOptions({
    queryKey: [...recordKey(slug, id), "contact_points"],
    queryFn: () => api.get<Paginated<ContactPoint>>(`/networks/${slug}/organizations/${id}/contact_points`, { per_page: 50 }),
    select: (page: Paginated<ContactPoint>) => page.data,
  });

export interface NewContactPoint {
  kind: string;
  occurred_at?: string;
  summary: string;
}

export const createContactPoint = (slug: string, id: string, contact_point: NewContactPoint): Promise<ContactPoint> =>
  api.post<ContactPoint>(`/networks/${slug}/organizations/${id}/contact_points`, { contact_point });

export const deleteContactPoint = (slug: string, id: string, pointId: string): Promise<void> =>
  api.delete<void>(`/networks/${slug}/organizations/${id}/contact_points/${pointId}`);
