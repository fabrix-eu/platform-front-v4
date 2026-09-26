import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/manage-your-team/";

const ROLES = [
  ["Owner", "Everything a Manager can do, plus inviting and removing people and changing roles. An organisation always keeps at least one owner: the last one cannot step down or leave."],
  ["Manager", "Edits the profile and its data, posts and manages listings, runs the Compass, manages connections. Cannot touch the team."],
  ["Team", "A read-only role announced in the panel, not available yet."],
];

const MENU = [
  ["Make owner / Make manager", "Changes the person's role. Making someone an owner asks for a confirmation, because they can then remove you."],
  ["Step down to manager", "On your own row, as an owner. Refused if you are the only owner."],
  ["Remove from team / Leave the team", "Takes the person, or you, off the organisation. They keep their account; the organisation keeps its profile and history."],
  ["Resend / Cancel", "On a pending invitation: send the email again, or withdraw it."],
];

/** A how-to for owners: who is on the team, how they got there, and what each one may do. */
export function ManageYourTeam() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Your organisation is managed by people, and people change jobs. The <strong>Team</strong> tab is where
        you add colleagues, answer those who ask to join, and set who may do what — so the profile never
        depends on one person.
      </p>

      <Banner tone="info" label="Owners only" className="mt-6">
        Managers see the team; only owners can invite, accept, change roles and remove. If the buttons
        below are missing, ask an owner.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Open the Team tab">
          <p>
            <strong>Profile</strong> in the sidebar, then the <strong>Team</strong> tab. Top to bottom: the
            people who asked to join, the members, the roles panel, and — while you are the only member —
            the way to give the profile back.
          </p>
          <Figure src={`${SHOT}01-team.png`} alt="The Team tab: a join request awaiting an answer, the single owner, the roles panel and the Give up this profile section" caption="As the only member sees it. The join request comes with the message its author wrote." />
        </Step>

        <Step n={2} title="Invite a colleague">
          <p>
            Press <strong>Invite colleague</strong> and type their email. Someone who already has a FABRIX
            account joins at once, as a manager; anyone else gets an email and appears as{" "}
            <em>Pending</em> until they sign up. Invitations expire after seven days; resend or cancel them
            from their row.
          </p>
          <Figure src={`${SHOT}02-invite.png`} alt="The Invite a colleague dialog with the email field" />
        </Step>

        <Step n={3} title="Answer a join request">
          <p>
            People can ask to join from your public profile. Their request shows at the top with their
            message. <strong>Accept</strong> adds them as a manager. <strong>Decline</strong> asks for a
            reason, which they receive — write one they can act on.
          </p>
          <Figure src={`${SHOT}03-decline.png`} alt="The Decline dialog: a required reason, sent to the person" />
        </Step>

        <Step n={4} title="Set roles, remove people, or leave">
          <p>
            Each row ends with a <strong>⋯</strong> menu. What it offers depends on the row: a colleague, an
            invitation, or you.
          </p>
          <Figure src={`${SHOT}04-members.png`} alt="The members list: an owner, a manager, and a pending invitation" />
          <Figure src={`${SHOT}05-member-actions.png`} alt="The actions menu on a manager's row: Make owner, Remove from team" />
          <FactList rows={MENU} />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The roles</Eyebrow>
      <FactList rows={ROLES} />

      <Eyebrow className="mt-12 mb-3">Giving the profile back</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        When you are the last person on the team, the tab ends with <strong>Give up this profile</strong>. The
        organisation returns to the directory as an unclaimed profile: it stays on the map with its
        connections, and whoever really runs it can claim it later. Your place on the team, the private
        figures, the listings and the Compass answers go. Taking it back means claiming it again — see{" "}
        <Link to="/manual/$page" params={{ page: "claim-your-organisation" }} className={link}>
          Claim your organisation
        </Link>
        .
      </p>

      <Banner tone="info" className="mt-10">
        Wanting to join someone else's organisation is the other side of this page:{" "}
        <Link to="/manual/$page" params={{ page: "join-an-organisation" }} className={link}>
          Join an organisation
        </Link>
        .
      </Banner>
    </div>
  );
}
