import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { api, type Paginated } from "@/lib/api";
import type {
  Network,
  NetworkCandidate,
  NetworkInvitation,
  NetworkMember,
  NetworkOrganization,
  NetworkTask,
} from "./types";

/** Everything under one network, so a change refreshes the whole dashboard. */
export const networkKey = (slug: string) => ["network", slug];

export const networkQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...networkKey(slug), "detail"],
    queryFn: () => api.get<Network>(`/networks/${slug}`),
  });

// The CRM records. `search` is a has_scope on the organisation behind the record.
export const networkOrganizationsQueryOptions = (slug: string, search?: string) =>
  infiniteQueryOptions({
    queryKey: [...networkKey(slug), "organizations", search ?? ""],
    queryFn: ({ pageParam }) =>
      api.get<Paginated<NetworkOrganization>>(`/networks/${slug}/organizations`, {
        page: pageParam,
        per_page: 20,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.current_page < last.meta.total_pages ? last.meta.current_page + 1 : undefined),
  });

/** A cheap count for the overview: one record, read the meta. */
export const networkOrganizationsCountQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...networkKey(slug), "organizations", "count"],
    queryFn: () => api.get<Paginated<NetworkOrganization>>(`/networks/${slug}/organizations`, { per_page: 1 }),
    select: (page: Paginated<NetworkOrganization>) => page.meta.total_count,
  });

export const networkTasksQueryOptions = (slug: string, filter: "open" | "done") =>
  queryOptions({
    queryKey: [...networkKey(slug), "tasks", filter],
    queryFn: () => api.get<Paginated<NetworkTask>>(`/networks/${slug}/tasks`, { [filter]: true, per_page: 100 }),
  });

export interface NewTask {
  title: string;
  due_on?: string;
  network_organization_id?: string;
}

export const createTask = (slug: string, network_task: NewTask): Promise<NetworkTask> =>
  api.post<NetworkTask>(`/networks/${slug}/tasks`, { network_task });

/** `done` is not a column: the API turns it into `done_at`. */
export const setTaskDone = (slug: string, id: string, done: boolean): Promise<NetworkTask> =>
  api.patch<NetworkTask>(`/networks/${slug}/tasks/${id}`, { network_task: { done } });

export const deleteTask = (slug: string, id: string): Promise<void> => api.delete<void>(`/networks/${slug}/tasks/${id}`);

export const networkMembersQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...networkKey(slug), "members"],
    queryFn: () => api.get<Paginated<NetworkMember>>(`/networks/${slug}/members`, { per_page: 100 }),
    select: (page: Paginated<NetworkMember>) => page.data,
  });

export const networkCandidatesQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...networkKey(slug), "candidates"],
    queryFn: () => api.get<NetworkCandidate[]>(`/networks/${slug}/members/candidates`),
  });

export const networkInvitationsQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: [...networkKey(slug), "invitations"],
    queryFn: () => api.get<NetworkInvitation[]>(`/networks/${slug}/invitations`),
  });

/** One endpoint, two doors: an email invites, a user_id grants straight away. */
export const inviteFacilitator = (slug: string, email: string): Promise<unknown> =>
  api.post(`/networks/${slug}/members`, { email });

export const grantAccess = (slug: string, user_id: string): Promise<unknown> =>
  api.post(`/networks/${slug}/members`, { user_id });

export const removeMember = (slug: string, id: string): Promise<void> =>
  api.delete<void>(`/networks/${slug}/members/${id}`);

export const cancelInvitation = (slug: string, id: string): Promise<void> =>
  api.delete<void>(`/networks/${slug}/invitations/${id}`);

export const resendInvitation = (slug: string, id: string): Promise<NetworkInvitation> =>
  api.post<NetworkInvitation>(`/networks/${slug}/invitations/${id}/resend`);
