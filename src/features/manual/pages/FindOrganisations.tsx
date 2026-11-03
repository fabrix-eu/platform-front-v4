import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/find-organisations/";

const FILTERS = [
  ["Search", "Words in the name or description."],
  ["In the value chain", "The stages they work in, from raw materials to collection & recovery — several at once."],
  ["Supporting the chain", "How they support it: logistics, machinery, design, consulting, research, finance, digital…"],
  ["On the marketplace", "What they offer or look for right now: the organisations with a live listing of that activity."],
  ["Where", "Near my organisation with a radius, or Everywhere, plus a country — as on the marketplace."],
  ["Status", "All, On FABRIX (someone manages the profile), or Claimable (on the map, nobody has claimed it yet)."],
];

const CARD = [
  ["Position and badge", "Where the organisation sits in the value chain, and Claimable when nobody runs the profile yet."],
  ["Description and address", "The first lines of their About, and where they are."],
  ["Connections", "How many organisations they are linked to — a quick read of how active they are on FABRIX."],
];

/** A how-to for the directory: what is in it, how to narrow it, what to do with what you find. */
export function FindOrganisations() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        The Directory is every organisation of the ecosystem, managed or not: the ones on FABRIX, and the
        ones a partner or the FABRIX team put on the map for their team to claim. It is the place to find a
        supplier, a recycler, a designer near you — or to check whether yours is already there.
      </p>

      <Banner tone="info" label="Signed in only" className="mt-6">
        Unlike the marketplace and events, the Directory needs an account. Visitors reach organisations
        through listings and events, or by searching at sign-up.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Open the Directory">
          <p>
            <strong>Directory</strong> in the sidebar. Like the marketplace, it opens on what is near your
            organisation, {`100`} km around, and every choice is in the page's address.
          </p>
          <Figure src={`${SHOT}01-directory.png`} alt="The Directory in cards view: filters on the left, the count within 100 km, organisation cards" />
        </Step>

        <Step n={2} title="Narrow it">
          <FactList rows={FILTERS} />
          <Figure src={`${SHOT}02-stages.png`} alt="The In the value chain filter with 06 Use & upkeep and 07 Collection & recovery picked" caption="Stages combine: pick Use & upkeep and Collection & recovery to see the end of the chain." />
        </Step>

        <Step n={3} title="Read the cards, or the map">
          <FactList rows={CARD} />
          <p>
            <strong>Map</strong> colours the pins by status — On FABRIX or Claimable — with your radius
            drawn. Click a pin for the organisation's card.
          </p>
          <Figure src={`${SHOT}03-map.png`} alt="The Directory map, filtered on Claimable, with the legend On FABRIX / Claimable" />
        </Step>

        <Step n={4} title="Act on what you found">
          <p>
            A card opens the profile. From there: <strong>Connect</strong> to declare how you work
            together, <strong>Message</strong> if the profile is managed, <strong>Request to join</strong> if
            it is yours and managed, <strong>Claim this profile</strong> if it is yours and nobody runs it
            yet. Not there at all? <strong>Add an organisation</strong>, top right — see{" "}
            <Link to="/manual/$page" params={{ page: "add-a-partner" }} className={link}>
              Add a partner
            </Link>
            .
          </p>
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What the Directory does not do</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        No bookmarks or saved lists yet: the connection you declare is how you keep an organisation close.
        No sorting either: results are alphabetical, and the filters decide what is in. The vocabulary
        behind What they do is in{" "}
        <Link to="/manual/$page" params={{ page: "what-you-do" }} className={link}>
          What you do
        </Link>
        .
      </p>
    </div>
  );
}
