import { infiniteQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AppNotification } from "./types";

export const NOTIFICATIONS_KEY = ["notifications"];

export const PER_PAGE = 20;

// GET /notifications → { notifications: [...] }, not the usual `{ data, meta }`.
// Pagy paginates it but the payload carries no meta, so a full page is the only
// sign that another one may follow.
export const notificationsQueryOptions = infiniteQueryOptions({
  queryKey: [...NOTIFICATIONS_KEY, "list"],
  queryFn: ({ pageParam }) =>
    api
      .get<{ notifications: AppNotification[] }>("/notifications", { page: pageParam, per_page: PER_PAGE })
      .then((response) => response.notifications),
  initialPageParam: 1,
  getNextPageParam: (last, all) => (last.length === PER_PAGE ? all.length + 1 : undefined),
});

export const markNotificationRead = (id: string): Promise<AppNotification> =>
  api.patch<AppNotification>(`/notifications/${id}/mark_as_read`);

/** Returns 204 — nothing to read back. */
export const markAllNotificationsRead = (): Promise<void> => api.patch<void>("/notifications/mark_all_as_read");
