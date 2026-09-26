import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RELATION_TYPES } from "@/features/organizations/relations";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/add-a-partner/";

const RULES = [
  ["Direction", "A connection goes from the organisation that declared it to the other: “you → them” on your list, “them → you” on theirs. It says who said it, not who supplies whom — the relation type says that."],
  ["Both sides", "Members of either organisation can remove it, from their Connections page or from the other's profile. Neither side approves it: a declared connection is live at once."],
  ["Unclaimed partners", "You can connect to a profile nobody manages. It shows Not claimed yet on your list until its team claims it, and the connection is waiting for them when they do."],
  ["Several organisations", "When you belong to more than one, the profile's Connect dialog asks On behalf of which. Your Connections page is always the current organisation's."],
  ["What it shows", "Every connection is on both public profiles with its type and details, and counts in the Directory's connection number."],
];

/** The rules of a connection, and the three doors to one. */
export function AddAPartner() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A partner on FABRIX is a connection: a typed, directed link between two organisations, visible on
        both profiles. This page is the rules; the guided walk, with the invitation of a partner who is not
        here yet, is{" "}
        <Link to="/manual/$page" params={{ page: "bring-your-partners" }} className={link}>
          Bring your partners
        </Link>
        .
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Three doors">
          <p>
            <strong>Connections</strong> in the sidebar → <strong>Add a connection</strong>: search, pick,
            say how. The other organisation's <strong>profile</strong> → <strong>Connect</strong>: the same
            two fields, for the organisation you are looking at. And <strong>Add an organisation</strong>{" "}
            (organisation switcher, Directory, home page) when the partner is not on FABRIX: it creates their
            profile and invites them — then connect to it from either door above.
          </p>
          <Figure src={`${SHOT}01-connect-dialog.png`} alt="The Connect dialog on a profile: On behalf of, the relation type, and details" caption="From a profile, for a member of two organisations." />
        </Step>

        <Step n={2} title="Say how you work together">
          <p>One relation type per connection, from six:</p>
          <ul className="flex flex-col">
            {RELATION_TYPES.map((type) => (
              <li key={type.value} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-fx-line py-2 first:border-t-0">
                <Badge tone="violet">{type.label}</Badge>
                <span className="text-fx-small text-fx-ink2">{type.description}</span>
              </li>
            ))}
          </ul>
          <p>
            <strong>Details</strong> are optional and public: what you exchange, since when. One
            connection per direction between two organisations: to change its type, remove it and declare
            it again. The other organisation can declare its own, in the other direction.
          </p>
        </Step>

        <Step n={3} title="Check, and remove when it ends">
          <p>
            On a profile you are connected to, the button reads <strong>Connected</strong> and opens the
            list of connections between you, each with <strong>Remove</strong>. Your{" "}
            <strong>Connections</strong> page lists them all, with the direction, the type, the details and
            the Not claimed yet badge where it applies.
          </p>
          <Figure src={`${SHOT}02-connected.png`} alt="The Connected dialog on a partner's profile: the existing connection with Remove, and the form to add another" />
          <Figure src="/manual/bring-your-partners/08-list.png" alt="The Connections page with two partners, their type, direction and Not claimed yet badge" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The rules</Eyebrow>
      <FactList rows={RULES} />

      <Banner tone="info" className="mt-10">
        Connections are the referral loop: each one puts a partner on your profile, on the map, and — when
        they are not here yet — in front of an invitation. Why that matters is in{" "}
        <Link to="/manual/$page" params={{ page: "how-the-network-grows" }} className={link}>
          How the network grows
        </Link>
        .
      </Banner>
    </div>
  );
}
