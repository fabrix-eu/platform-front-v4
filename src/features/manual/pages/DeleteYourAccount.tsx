import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/delete-your-account/";

const OUTCOMES = [
  ["You share the organisation with colleagues", "It carries on without you. If you were its only owner, the longest-standing member becomes owner, so nobody is locked out."],
  ["You are its only member", "The organisation goes back to the directory as an unclaimed profile. Its listings and its Compass answers are deleted; the entry itself stays, with its connections, so partners who declared a link to it keep it."],
  ["You have several organisations", "Each one is settled on its own, by the same two rules."],
  ["Everything personal", "Your profile, your messages, your notifications and your preferences go with the account."],
];

/** A how-to for a rare, irreversible action: what it does to what you leave behind. */
export function DeleteYourAccount() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Deleting your account is immediate and cannot be undone. What it does to your organisation depends
        on one thing: whether anyone else is on its team.
      </p>

      <Banner tone="info" label="Leaving, not deleting?" className="mt-6">
        If you only want out of one organisation, you do not need this: leave its team from the profile's{" "}
        <strong>Team</strong> tab, or give the profile back — see{" "}
        <Link to="/manual/$page" params={{ page: "manage-your-team" }} className={link}>
          Manage your team
        </Link>
        . Changing email or password is in the same settings, above this section.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Settle your organisations first">
          <p>
            Read the outcomes below. If you are the only owner of a team that must carry on, make a colleague
            owner yourself, from the Team tab, rather than letting the platform pick. If you are the only
            member and the profile should stay alive, invite a colleague first and wait for them to join.
          </p>
        </Step>

        <Step n={2} title="Open your settings">
          <p>
            Open the menu under your name, choose <strong>Settings</strong>. The <strong>Account</strong> tab
            ends with <em>Delete your account</em>.
          </p>
          <Figure src={`${SHOT}01-danger-zone.png`} alt="The Delete your account section at the end of the account settings" />
        </Step>

        <Step n={3} title="Confirm">
          <p>
            Press <strong>Delete my account</strong>. The dialog repeats what is about to happen; confirm with
            the red button, or <strong>Keep my account</strong>. On confirmation you are signed out and
            returned to the public site. The email address is free to sign up again, but nothing comes back.
          </p>
          <Figure src={`${SHOT}02-confirm.png`} alt="The confirmation dialog: this cannot be undone, with Keep my account and Delete my account" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What happens to what you leave</Eyebrow>
      <FactList rows={OUTCOMES} />
    </div>
  );
}
