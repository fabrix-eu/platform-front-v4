import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { FactList, proseLink as link } from "../parts";

const PERSON = [
  ["Your account", "A name, an email, a password, a photo. Yours alone; nobody else signs in as you."],
  ["Your settings", "Notifications, email, password — personal, whatever organisations you belong to."],
  ["Your answers to events", "Going or not is said by a person: you go, your organisation does not."],
  ["Your feedback", "Sent under your name, so the team can write back."],
  ["Your memberships", "The organisations you belong to, with a role in each. The switcher in the sidebar lists them."],
];

const ORGANISATION = [
  ["The profile", "Name, address, what it does, photos, size: the thing partners find on the map."],
  ["Listings, connections, events", "Published in the organisation's name, edited by any of its members, kept when the person who wrote them leaves."],
  ["Messages", "A mailbox per organisation, read and answered by its whole team. Nobody writes to a person."],
  ["The Compass", "Answers and scores belong to the organisation; whoever on the team answers, answers for it."],
  ["Its team", "The people who can act for it, with two roles. It survives every one of them: the last owner cannot leave it ownerless, and the last member hands it back to the directory rather than deleting it."],
];

const CONSEQUENCES = [
  ["Signed in with no organisation", "You exist, but you can only read. Everything that reaches out — a listing, a connection, a message — needs an organisation to reach out from. The home page asks for one first."],
  ["Several organisations", "One person, several hats. The switcher chooses the hat; what you do is done for the organisation shown, and its mailbox is the one you read."],
  ["Leaving", "Leave a team and you lose access to that organisation, nothing else; your account and your other memberships are untouched. Delete your account and each organisation is settled on its own."],
  ["Who did it", "Everything an organisation does carries the name of the person who did it — a message is signed, a listing has a poster, a connection has a declarer. Partners see the organisation; the team sees who."],
];

/** Explanation: the two kinds of thing on FABRIX, and how one acts through the other. */
export function PeopleAndOrganisations() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Two kinds of thing exist on FABRIX: people, who sign in, and organisations, which are on the map.
        A person acts <em>for</em> an organisation. Almost every question about who sees what, who may
        change what, and what happens when someone leaves, comes down to this one distinction.
      </p>

      <Eyebrow className="mt-10 mb-3">What is yours as a person</Eyebrow>
      <FactList rows={PERSON} />

      <Eyebrow className="mt-12 mb-3">What belongs to the organisation</Eyebrow>
      <FactList rows={ORGANISATION} />

      <Eyebrow className="mt-12 mb-3">Why it is drawn this way</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        A circular chain is made of organisations: a sorter supplies a recycler, a recycler a spinner. The
        person who arranges it may change jobs next year; the relationship, the listings and the messages
        should not vanish with them. So the organisation is the durable thing, and people are its hands —
        several at a time, replaceable one by one. It is also why a profile can exist before anyone from it
        has signed up: the organisation was already real, the platform only had to make room for it.
      </p>

      <Eyebrow className="mt-12 mb-3">What follows</Eyebrow>
      <FactList rows={CONSEQUENCES} />

      <Banner tone="info" className="mt-10">
        Which of the two kinds of role you hold, and what each may do, is in{" "}
        <Link to="/manual/$page" params={{ page: "roles-and-permissions" }} className={link}>
          Roles and permissions
        </Link>
        ; the life of a profile before and after its team arrives, in{" "}
        <Link to="/manual/$page" params={{ page: "claimed-and-unclaimed" }} className={link}>
          Claimed and unclaimed
        </Link>
        .
      </Banner>
    </div>
  );
}
