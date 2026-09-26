import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NOTIFICATION_TYPE_LABELS } from "@/features/settings/api";
import { FactList, proseLink as link } from "../parts";

interface Row {
  when: string;
  who: string;
  leads: string;
  always?: boolean;
  dormant?: boolean;
}

/** What triggers each type, who gets it, where it leads — keyed like the preferences. */
const ROWS: Record<string, Row> = {
  join_request_received: { when: "Someone asks to join your organisation.", who: "Its owners.", leads: "The Team tab, where the request waits.", always: true },
  join_request_accepted: { when: "Owners accept your request.", who: "You.", leads: "The organisation's profile." },
  join_request_declined: { when: "Owners decline it, with a reason.", who: "You.", leads: "The organisation's profile; the reason is in the notification." },
  organization_member_joined: { when: "Someone you invited joins the team.", who: "The person who sent the invitation.", leads: "The Team tab." },
  organization_invitation_accepted: { when: "An invitation you received is accepted.", who: "The invited person.", leads: "The Team tab." },
  organization_claimed: { when: "A profile is claimed through an invitation to claim.", who: "The person who invited.", leads: "The organisation's profile.", always: true, dormant: true },
  event_created: { when: "An event is published.", who: "Organisations around it.", leads: "The event.", dormant: true },
  nearby_organization_created: { when: "An organisation is created within ten kilometres of yours.", who: "Every member of yours.", leads: "The new organisation's profile.", dormant: true },
};

const CHANNELS = [
  ["In the app", "The Notifications page, and the count next to it in the sidebar, refreshed every minute and on every page change. Opening a row marks it read; Mark all as read clears the count."],
  ["By email", "The same notification, sent to your address, when the row's Email switch is on. Always on rows are emailed regardless."],
  ["Preferences", "Settings › Notifications: one row per type with On, In app and Email. Always on rows cannot be changed."],
  ["Not notifications", "Messages have their own count next to Messages in the sidebar, and their own email. Feedback and claims reviewed by the FABRIX team come back by email only."],
];

/** Reference: the notification types, rendered from the labels the settings use. */
export function NotificationTypes() {
  const types = Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => ({ key, label, ...ROWS[key] }));
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A notification is the platform telling you that something happened to your organisation, your
        team, or around you. There are {types.length} kinds. Each has a trigger, a recipient and a place it
        leads to when opened.
      </p>

      <Eyebrow className="mt-10 mb-3">The kinds</Eyebrow>
      <div className="overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper">
        <table className="w-full text-fx-small">
          <thead>
            <tr className="border-b border-fx-line bg-fx-panel font-fx-display text-fx-label text-fx-muted uppercase">
              <th className="px-4 py-3 text-left font-normal">Notification</th>
              <th className="px-3 py-3 text-left font-normal">When</th>
              <th className="px-3 py-3 text-left font-normal">Who</th>
              <th className="px-4 py-3 text-left font-normal">Leads to</th>
            </tr>
          </thead>
          <tbody>
            {types.map((row) => (
              <tr key={row.key} className="border-b border-fx-line align-top last:border-b-0">
                <td className="px-4 py-2.5 font-bold text-fx-ink">
                  {row.label}
                  {row.always && <span className="ml-2 text-fx-label font-normal text-fx-muted">Always on</span>}
                  {row.dormant && <span className="ml-2 text-fx-label font-normal text-fx-amber">Not sent for the moment</span>}
                </td>
                <td className="px-3 py-2.5 text-fx-ink2">{row.when}</td>
                <td className="px-3 py-2.5 text-fx-ink2">{row.who}</td>
                <td className="px-4 py-2.5 text-fx-ink2">{row.leads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-fx-label text-fx-muted">
        Labels come from the settings page itself. “Not sent for the moment” marks the kinds the platform
        lists but does not produce yet.
      </p>

      <Eyebrow className="mt-12 mb-3">Channels</Eyebrow>
      <FactList rows={CHANNELS} />

      <Banner tone="info" className="mt-10">
        How to set the switches is in{" "}
        <Link to="/manual/$page" params={{ page: "manage-notifications" }} className={link}>
          Manage notifications
        </Link>
        .
      </Banner>
    </div>
  );
}
