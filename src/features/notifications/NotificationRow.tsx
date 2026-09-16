import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { User } from "@/lib/auth";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { notificationTarget } from "./links";
import type { AppNotification } from "./types";

interface NotificationRowProps {
  notification: AppNotification;
  me: User;
  /** Reading it is opening it — the row clears itself on the way out. */
  onRead: (id: string) => void;
}

const ROW = "flex w-full items-start gap-3 px-4 py-3.5 text-left";

export function NotificationRow({ notification, me, onRead }: NotificationRowProps) {
  const target = notificationTarget(notification, me);
  const unread = !notification.read;
  const who = notification.actor?.name ?? "FABRIX";

  const body: ReactNode = (
    <>
      <Avatar name={who} src={notification.actor?.image_url} kind="person" size="sm" />
      <span className="min-w-0 flex-1">
        <span className={cn("block text-fx-small", unread ? "font-bold text-fx-ink" : "text-fx-ink2")}>{notification.message}</span>
        <time dateTime={notification.created_at} className="mt-0.5 block text-fx-label text-fx-muted">
          {timeAgo(notification.created_at)}
        </time>
      </span>
      {unread && <span aria-label="Unread" className="mt-1.5 size-2 shrink-0 rounded-full bg-fx-emphasis" />}
    </>
  );

  const className = cn(ROW, unread && "bg-fx-emphasis-soft/50", target && "hover:bg-fx-panel");
  const open = () => unread && onRead(notification.id);

  return (
    <li className="border-t border-fx-line first:border-t-0">
      {target?.kind === "team" ? (
        <Link to="/$orgSlug/profile" params={{ orgSlug: target.orgSlug }} search={{ tab: "team" }} onClick={open} className={className}>
          {body}
        </Link>
      ) : target?.kind === "organization" ? (
        <Link to="/organizations/$id" params={{ id: target.id }} preload="intent" onClick={open} className={className}>
          {body}
        </Link>
      ) : target?.kind === "event" ? (
        <Link to="/events/$eventId" params={{ eventId: target.id }} preload="intent" onClick={open} className={className}>
          {body}
        </Link>
      ) : (
        // Legacy types (communities, challenges) still carry a message, but lead nowhere.
        <button type="button" onClick={open} disabled={!unread} className={cn(className, unread && "hover:bg-fx-panel")}>
          {body}
        </button>
      )}
    </li>
  );
}
