import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RELATION_TYPES } from "@/features/organizations/relations";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/bring-your-partners/";

const AFTER = [
  ["Your profile", "Every connection is listed on your public page, with the way you work together. Partners and facilitators read it as your place in the chain."],
  ["Their profile", "A partner added by you is on the map and in the directory from that moment, with your connection on it, marked Unclaimed until they take it over."],
  ["Their inbox", "The person you named receives an invitation to claim the profile. Once they do, the “Not claimed yet” badge goes, and the profile is theirs to complete."],
  ["Either side", "A connection belongs to both organisations: either can remove it, from Connections or from the other's profile."],
];

/**
 * A tutorial for the referral loop: connect to the partners already here, add and
 * invite the ones who are not. Relation types come from the module the dialog uses.
 */
export function BringYourPartners() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        FABRIX is worth as much as the partners on it. This walk brings your first three: the ones already
        here, which you connect to in a minute each, and the ones not here yet, which you add and invite.
        Ten minutes, and your part of the value chain is on the map.
      </p>

      <Banner tone="info" label="Before you start" className="mt-6">
        You need an organisation on FABRIX (
        <Link to="/manual/$page" params={{ page: "getting-started" }} className={link}>
          Getting started
        </Link>
        ). Have the names of two or three partners in mind, and the email of the person you know there.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Start from Connections">
          <p>
            In the sidebar, under your organisation's name, choose <strong>Connections</strong>. Your home
            page also opens it, from the card called <em>The loop</em>.
          </p>
          <Figure src={`${SHOT}01-the-loop.png`} alt="The loop card on the home page, with its Add a partner button" />
          <Figure src={`${SHOT}02-connections.png`} alt="The Connections page, empty, with the Add a connection button" caption="Connections, before the first one." />
        </Step>

        <Step n={2} title="Look for the partner first">
          <p>
            Press <strong>Add a connection</strong> and type the partner's name — two letters are enough.
            Each result says <strong>Managed</strong> (someone runs that profile) or{" "}
            <strong>Claimable</strong> (it is on FABRIX, added by someone else, and nobody has claimed it
            yet). Both can be connected to.
          </p>
          <Figure src={`${SHOT}03-search.png`} alt="The Add a connection dialog, with a search result marked Claimable and a Create row" caption="Found. The dashed row and the link below are for a partner who is not here yet — step 4." />
        </Step>

        <Step n={3} title="Say how you work together">
          <p>Pick the partner, then the relation, from six:</p>
          <ul className="flex flex-col">
            {RELATION_TYPES.map((type) => (
              <li key={type.value} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-fx-line py-2 first:border-t-0">
                <Badge tone="violet">{type.label}</Badge>
                <span className="text-fx-small text-fx-ink2">{type.description}</span>
              </li>
            ))}
          </ul>
          <p>
            <strong>Anything to add?</strong> is optional and visible to both organisations — what you
            exchange, or since when. Press <strong>Add connection</strong>.
          </p>
          <Figure src={`${SHOT}04-relation.png`} alt="The second step of the dialog: the chosen partner, the relation type and a note" />
        </Step>

        <Step n={4} title="Not on FABRIX yet? Add them">
          <p>
            When the search finds nothing, follow <strong>Add it and invite them to claim it</strong>. It
            opens the <em>Add an organisation</em> page. Search once more there, choose{" "}
            <strong>Create “…”</strong>, and answer <strong>Who is it to you?</strong> with{" "}
            <strong>It's a partner I work with</strong>.
          </p>
          <Figure src={`${SHOT}05-who.png`} alt="The Who is it to you? step, with It's a partner I work with selected" />
        </Step>

        <Step n={5} title="Their details, and the person to invite">
          <p>
            Their name, their type, and their <strong>address</strong> picked from the suggestions — that is
            what puts them on the map. <strong>What you do</strong> is optional; pick what you know. Then{" "}
            <strong>Their email</strong>: the person who should run the profile. It is optional, but it is
            the whole point — that email is the invitation. Press <strong>Add partner</strong>.
          </p>
          <Figure src={`${SHOT}06-details.png`} alt="The details form of a partner: name, type, address on the map, what they do, and their email" />
          <Figure src={`${SHOT}07-partner-added.png`} alt="Partner added: the confirmation, with Add another partner" caption="Add another partner keeps you in the flow — do the whole list while you are here." />
        </Step>

        <Step n={6} title="Come back and connect">
          <p>
            Adding a partner creates their profile and sends the invitation; it does not yet say how you
            work together. Return to <strong>Connections</strong>, press <strong>Add a connection</strong>,
            and they are in the results now. Say the relation, as in step 3.
          </p>
          <Figure src={`${SHOT}08-list.png`} alt="Connections with two partners, each marked Supplier / customer and Not claimed yet" caption="Not claimed yet: the badge stays until they claim their profile." />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What happens next</Eyebrow>
      <FactList rows={AFTER} />

      <Banner tone="info" className="mt-10">
        That is the whole of <em>Start here</em>: you are findable, you have something on the marketplace,
        and your partners are around you. The rest of the manual is there when you need it — the{" "}
        <Link to="/manual" className={link}>
          contents
        </Link>{" "}
        are sorted by what you came for.
      </Banner>
    </div>
  );
}
