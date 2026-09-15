import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

// JoinRequestBlueprint — asking to become a member of an organisation someone manages.
export interface JoinRequest {
  id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  message: string;
  created_at: string;
  organization: { id: string; name: string; slug: string };
}

export const myJoinRequestsQueryOptions = queryOptions({
  queryKey: ["join-requests", "mine"],
  queryFn: () => api.get<JoinRequest[]>("/my/join_requests"),
});

/** The owners review it; `message` is 10 to 2000 characters. */
export function requestToJoin(organizationId: string, message: string) {
  return api.post<JoinRequest>(`/organizations/${organizationId}/join_requests`, { join_request: { message } });
}
