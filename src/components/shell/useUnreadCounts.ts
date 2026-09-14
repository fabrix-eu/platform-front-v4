import { useQuery } from "@tanstack/react-query";
import { unreadMessagesQueryOptions } from "@/features/messages/queries";
import { unreadNotificationsQueryOptions } from "@/features/notifications/queries";

/** Prefix shared by every unread counter, to refresh them all at once. */
export const UNREAD_KEY = ["unread"];

export interface UnreadCounts {
  notifications: number;
  messages: number;
}

// Not suspense: the sidebar renders at once and the counts fill in; a failed
// count shows nothing rather than breaking the navigation.
export function useUnreadCounts(): UnreadCounts {
  const notifications = useQuery(unreadNotificationsQueryOptions);
  const messages = useQuery(unreadMessagesQueryOptions);
  return { notifications: notifications.data ?? 0, messages: messages.data ?? 0 };
}
