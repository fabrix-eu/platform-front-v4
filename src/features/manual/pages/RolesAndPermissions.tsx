import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactList, proseLink as link } from "../parts";

const WHO = ["Visitor", "Signed in, not a member", "Manager", "Owner"];

/** One row per capability; one mark per column of WHO. */
const MATRIX: [string, string][] = [
  ["Read profiles, the marketplace and events", "●●●●"],
  ["Search the Directory", "○●●●"],
  ["Answer an event, send feedback", "○●●●"],
  ["Claim a profile, request to join, add an organisation or a partner", "○●●●"],
  ["Declare or remove a connection", "○○●●"],
  ["Message another organisation, read and answer its messages", "○○●●"],
  ["Edit the profile, its photos, logo and banner", "○○●●"],
  ["Post, edit, close and delete listings", "○○●●"],
  ["Add an event; edit or delete an event you created", "○○●●"],
  ["Run the Compass and read its results", "○○●●"],
  ["See the team", "○○●●"],
  ["Invite, accept or decline, change roles, remove people", "○○○●"],
  ["Give the profile back — only as its last member", "○○○●"],
];

const SYSTEM = [
  ["Facilitator", "Everything above, as a person and through their own organisations if they have any. Plus: their networks under Facilitator in the sidebar, the Data page, adding an event without belonging to an organisation, and reading the needs-and-opportunities self-assessment of the organisations they follow. Given by the FABRIX team, or by being added to a network."],
  ["Admin", "Everything a facilitator has, plus Administration: the list of organisations and networks, the claims to approve or reject, the feedback received. An admin can also edit or delete any event. The FABRIX team."],
];

const NOTES = [
  ["Manager and Owner are per organisation", "You can be owner of one organisation and manager of another. The switcher decides which one you act for."],
  ["An organisation always keeps an owner", "The last owner cannot step down, leave, or be removed. Deleting your account hands ownership to the longest-standing member."],
  ["Nothing is done as a person", "Listings, connections, events and messages are always in an organisation's name. Your name appears as the one who did it."],
  ["Signed in without an organisation", "A viewer: reads everything a member reads, including the Data page, and can create or claim an organisation. Cannot post, connect or write."],
];

function Matrix() {
  return (
    <div className="overflow-x-auto rounded-fx-lg border border-fx-line bg-fx-paper">
      <table className="w-full text-fx-small">
        <thead>
          <tr className="border-b border-fx-line bg-fx-panel font-fx-display text-fx-label text-fx-muted uppercase">
            <th className="px-4 py-3 text-left font-normal">Can…</th>
            {WHO.map((who) => (
              <th key={who} className="px-2 py-3 text-center font-normal">
                {who}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIX.map(([label, marks]) => (
            <tr key={label} className="border-b border-fx-line last:border-b-0">
              <td className="px-4 py-2.5 text-fx-ink2">{label}</td>
              {[...marks].map((mark, i) => (
                <td key={i} className={mark === "●" ? "px-2 py-2.5 text-center text-fx-emphasis" : "px-2 py-2.5 text-center text-fx-line2"} aria-label={mark === "●" ? "yes" : "no"}>
                  {mark}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Reference: who can do what, as the platform enforces it. */
export function RolesAndPermissions() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Two kinds of role. Towards an organisation you are a visitor, a signed-in person who is not on its
        team, a <strong>Manager</strong> or an <strong>Owner</strong>. On top of that, a few people carry a
        system role: <strong>Facilitator</strong> or <strong>Admin</strong>.
      </p>

      <Eyebrow className="mt-10 mb-3">Towards an organisation</Eyebrow>
      <Matrix />
      <p className="mt-2 text-fx-label text-fx-muted">
        Manager is what the platform calls a member who is not an owner. Accepting a join request or an
        invitation makes a manager; an owner can promote them.
      </p>

      <Eyebrow className="mt-12 mb-3">System roles</Eyebrow>
      <FactList rows={SYSTEM} />

      <Eyebrow className="mt-12 mb-3">Rules that follow</Eyebrow>
      <FactList rows={NOTES} />

      <Banner tone="info" className="mt-10">
        The team page describes the two roles in its own words and announces a read-only Team role that does
        not exist yet — see{" "}
        <Link to="/manual/$page" params={{ page: "manage-your-team" }} className={link}>
          Manage your team
        </Link>
        . What each part of a profile shows to whom is in{" "}
        <Link to="/manual/$page" params={{ page: "what-is-visible" }} className={link}>
          What is visible
        </Link>
        .
      </Banner>
    </div>
  );
}
