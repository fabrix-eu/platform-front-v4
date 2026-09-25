import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NOTIFICATION_TYPE_LABELS } from "@/features/settings/api";
import { Figure } from "../Figure";
import { proseLink as link, Step } from "../parts";

const SHOT = "/manual/manage-notifications/";

/** Where each type leads when opened — the same map the notification rows use. */
const LEADS_TO: Record<string, string> = {
  join_request_received: "Your profile's Team tab, where the request waits for an answer.",
  organization_member_joined: "The Team tab.",
  organization_invitation_accepted: "The Team tab.",
  join_request_accepted: "The organisation you asked to join.",
  join_request_declined: "The organisation that declined, with the reason in the notification.",
  organization_claimed: "The organisation's profile.",
  nearby_organization_created: "The new organisation's profile.",
  event_created: "The event.",
};

/** A how-to for the two sides of notifications: reading them, and deciding what reaches you. */
export function ManageNotifications() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Notifications live in two places. The <strong>Notifications</strong> page is what happened around
        your organisations; the <strong>Notifications</strong> tab of your settings is what is allowed to
        reach you, and how.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Read what happened">
          <p>
            <strong>Notifications</strong> is the last entry of the sidebar; the number next to it is what
            you have not read. <strong>All</strong> and <strong>Unread</strong> narrow the list. Opening a
            row marks it read and takes you where it happened; <strong>Mark all as read</strong> clears the
            count without opening anything.
          </p>
          <Figure src={`${SHOT}01-notifications.png`} alt="The Notifications page with two unread rows: a join request and a new organisation nearby" caption="Unread rows carry a dot. Newest first." />
        </Step>

        <Step n={2} title="Choose what reaches you">
          <p>
            Open the menu under your name, choose <strong>Settings</strong>, then the{" "}
            <strong>Notifications</strong> tab. One row per kind of notification, three switches:{" "}
            <strong>On</strong>, <strong>In app</strong>, <strong>Email</strong>. The two channels only
            count while the row is on. Changes save as you flip them.
          </p>
          <p>
            Rows marked <strong>Always on</strong> are requests that need an answer from you — someone
            asking to join, someone claiming a profile you are connected to. They cannot be switched off, and
            they are always sent by email as well.
          </p>
          <Figure src={`${SHOT}02-preferences.png`} alt="The notification preferences table: one row per type, with On, In app and Email switches" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What each one is, and where it leads</Eyebrow>
      <ul className="flex flex-col">
        {Object.entries(NOTIFICATION_TYPE_LABELS).map(([type, label]) => (
          <li key={type} className="border-t border-fx-line py-3 first:border-t-0">
            <p className="text-fx-body font-bold text-fx-ink">{label}</p>
            <p className="mt-0.5 text-fx-small text-fx-ink2">{LEADS_TO[type]}</p>
          </li>
        ))}
      </ul>

      <Banner tone="info" className="mt-10">
        Messages are not notifications: a new message shows as a count next to{" "}
        <strong>Messages</strong> in the sidebar and is never switched off here. See{" "}
        <Link to="/manual/$page" params={{ page: "send-a-message" }} className={link}>
          Send a message
        </Link>
        .
      </Banner>
    </div>
  );
}
