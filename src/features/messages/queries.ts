import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

// GET /conversations/unread_count → { data: { unread_count } }: conversations with unread messages.
export const unreadMessagesQueryOptions = queryOptions({
  queryKey: ["unread", "messages"],
  queryFn: () => api.get<{ unread_count: number }>("/conversations/unread_count").then((r) => r.unread_count),
  refetchInterval: 60_000,
});
