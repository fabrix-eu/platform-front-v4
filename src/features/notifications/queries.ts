import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

// GET /notifications/unread_count → { count } (no data envelope).
export const unreadNotificationsQueryOptions = queryOptions({
  queryKey: ["unread", "notifications"],
  queryFn: () => api.get<{ count: number }>("/notifications/unread_count").then((r) => r.count),
  refetchInterval: 60_000,
});
