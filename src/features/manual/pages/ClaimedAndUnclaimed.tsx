import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactList, proseLink as link } from "../parts";

const LIFE = [
  ["Born unclaimed, or born claimed", "A profile created by a partner, or by the FABRIX team from a register, starts unclaimed. One created by its own people — at sign-up, or with “It's my organisation” — starts claimed, with its creator as owner."],
  ["Claimed", "Someone from the organisation asked for it and the FABRIX team agreed, or an invited person accepted. From then on it has a team; the team edits it, posts for it, answers for it."],
  ["Given back", "The last member can hand the profile back to the directory, and deleting the last member's account does the same. It becomes unclaimed again: the public part stays, the private part is deleted."],
  ["Claimed again", "An unclaimed profile can always be claimed, including one that was given back. Its history of connections is still there."],
];

const KEEPS = [
  ["What an unclaimed profile has", "A name, a type, an address on the map, sometimes a description, a website and what it does — whatever whoever added it knew. Connections declared toward it. Possibly a pending claim."],
  ["What it cannot have", "A team, listings, Compass answers, a mailbox. It appears in the Directory as Claimable and on its page as Unclaimed; its Message button is absent, because there is nobody to read."],
  ["What claiming changes", "Nothing on the public side: the same profile, now with a team behind it. The badge goes; the Message button appears; the six essentials start being counted."],
  ["What giving back deletes", "Listings, Compass answers, invitations, join requests, the team itself, and the private figures — size, turnover, stage, registration details. Not the profile, its address, its photos, or the connections others declared to it — those belong to the map as much as to the organisation."],
];

const WHY = [
  ["Why unclaimed profiles exist at all", "Because the map has to be useful before everyone has signed up. A member who adds their sorter puts a real organisation in a real place; the sorter's absence from the platform is not a reason to leave a hole."],
  ["Why claiming is reviewed", "A profile stands for a real organisation; whoever claims it will speak in its name. A person from the FABRIX team reads the claim — who you are there, how to reach you — and says yes or no. Invitations short-cut this: the partner who added you already vouched."],
  ["Why giving back is not deleting", "Partners declared connections to that profile; a facilitator may follow it; it sits on the map where people expect it. Deleting it would take something from everyone else. Unclaiming takes back only what was the team's own."],
];

/** Explanation: the two states of a profile, what each holds, and why the platform has both. */
export function ClaimedAndUnclaimed() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Every organisation on FABRIX is in one of two states. <strong>Unclaimed</strong>: it is on the map,
        but nobody from it has taken it over. <strong>Claimed</strong>: it has a team. The state decides
        what the profile can do, and it can change in both directions.
      </p>

      <Eyebrow className="mt-10 mb-3">The life of a profile</Eyebrow>
      <FactList rows={LIFE} />

      <Eyebrow className="mt-12 mb-3">What each state holds</Eyebrow>
      <FactList rows={KEEPS} />

      <Eyebrow className="mt-12 mb-3">Why</Eyebrow>
      <FactList rows={WHY} />

      <Eyebrow className="mt-12 mb-3">How the words appear</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        In the Directory and at sign-up, an unclaimed profile is <em>Claimable</em> and a claimed one is{" "}
        <em>On FABRIX</em> or <em>Managed</em>. On the profile itself the badge reads <em>Unclaimed</em>. On
        your Connections page a partner still unclaimed is <em>Not claimed yet</em>. Four words, one state:
        each chosen for what the reader can do about it from where they stand.
      </p>

      <Banner tone="info" className="mt-10">
        Claiming a profile is in{" "}
        <Link to="/manual/$page" params={{ page: "claim-your-organisation" }} className={link}>
          Claim your organisation
        </Link>
        ; giving one back, at the end of{" "}
        <Link to="/manual/$page" params={{ page: "manage-your-team" }} className={link}>
          Manage your team
        </Link>
        .
      </Banner>
    </div>
  );
}
