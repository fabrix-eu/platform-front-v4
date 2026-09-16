import type { User } from "@/lib/auth";
import type { AppNotification } from "./types";

/**
 * Where a notification leads. A closed set the row can render as a typed link —
 * the router refuses a path assembled as a bare string.
 */
export type NotificationTarget =
  | { kind: "team"; orgSlug: string }
  | { kind: "organization"; id: string }
  | { kind: "event"; id: string };

const slugFor = (me: User, organizationId?: string): string | null =>
  me.organizations.find((membership) => membership.organization_id === organizationId)?.organization_slug ?? null;

/**
 * Community and challenge notification types are legacy — those features were
 * retired, so their rows render without a link rather than leading nowhere.
 * The team-facing ones land on the profile's Team tab, where members,
 * invitations and join requests now live.
 */
export function notificationTarget(notification: AppNotification, me: User): NotificationTarget | null {
  const organizationId = notification.metadata?.organization_id;
  const notifiableId = notification.notifiable?.id;

  switch (notification.notification_type) {
    case "join_request_received":
    case "organization_member_joined":
    case "organization_invitation_accepted": {
      const orgSlug = slugFor(me, organizationId);
      return orgSlug ? { kind: "team", orgSlug } : null;
    }

    case "join_request_accepted":
    case "join_request_declined":
    case "organization_claimed":
      return organizationId ? { kind: "organization", id: organizationId } : null;

    case "nearby_organization_created":
      return notifiableId ? { kind: "organization", id: notifiableId } : null;

    case "event_created":
      return notifiableId ? { kind: "event", id: notifiableId } : null;

    default:
      return null;
  }
}
