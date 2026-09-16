/** Named `AppNotification` so it never collides with the DOM's own `Notification`. */
export interface AppNotification {
  id: string;
  notification_type: string;
  scope: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
  /** Built by the server (`NotificationMessageBuilder`) — rendered as is. */
  message: string;
  metadata: Record<string, string>;
  actor: { id: string; name: string; image_url: string | null } | null;
  notifiable: { id: string; type: string } | null;
}
