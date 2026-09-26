import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DEFAULT_RADIUS_KM, RADIUS_OPTIONS } from "@/features/explore/location";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/search-the-marketplace/";

const FILTERS = [
  ["Search", "Words in the title or description. Results refresh as you type."],
  ["Offered or wanted", "Either, Offered, Wanted — whether the listing gives or asks."],
  ["Timing", "Any, One-off, Ongoing — a single occasion, or something supplied or needed again."],
  ["Activity → Category → Speciality", "The vocabulary listings are filed in. Pick an activity and its categories appear; pick a category and its specialities do. Each level narrows the last."],
  ["Location", `Near my organisation, within a radius of ${RADIUS_OPTIONS.join(", ")} km (${DEFAULT_RADIUS_KM} by default), or Everywhere. Plus a country, which applies either way.`],
];

const VIEWS = [
  ["Cards", "Photo, badges, title, the first lines, and who posted. Loads more as you scroll."],
  ["List", "One line per listing, denser, the same order and the same filters."],
  ["Map", "One pin per listing at its organisation's address, coloured by activity, with a legend and your radius drawn as a circle. Click a pin for its card. Every listing that matches is on the map at once, not page by page; a listing whose organisation has no address has no pin."],
];

/** A how-to for reading the marketplace: the filters, the location rule, the three views, and the URL. */
export function SearchTheMarketplace() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        The marketplace is every active listing of the network, filtered. It opens on what is close to
        your organisation, because that is what you can actually collect or deliver; widen it when you
        need to. Everything you set is in the page's address, so a filtered view can be sent to a
        colleague as a link.
      </p>

      <Banner tone="info" label="Open to all" className="mt-6">
        Visitors can search the marketplace without an account. For them there is no “near”: it opens on
        Everywhere. Contacting a poster is what needs an organisation.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Start from what is near you">
          <p>
            Signed in with an organisation that has an address, the marketplace opens on{" "}
            <strong>Near my organisation</strong>, {DEFAULT_RADIUS_KM} km around it. The count above the
            results says so. <strong>Everywhere</strong> drops the distance; the radius menu changes it.
          </p>
          <Figure src={`${SHOT}01-marketplace.png`} alt="The marketplace in cards view: the filters on the left, the count within 100 km, the view switch and the first cards" caption="The count is the truth of the filters: change one and it changes." />
        </Step>

        <Step n={2} title="Narrow it">
          <p>
            The filters are on the left, each one a row of choices. They combine: Offered, Materials,
            Waste streams, within 50 km, Netherlands. Picking an activity reveals its categories; picking a
            category reveals its specialities.
          </p>
          <Figure src={`${SHOT}02-filters.png`} alt="The filter column with Materials selected: the four categories of Materials appear, then the location choices" />
          <FactList rows={FILTERS} />
        </Step>

        <Step n={3} title="Pick a view">
          <p>
            <strong>Cards</strong>, <strong>List</strong> and <strong>Map</strong>, top right, show the same
            results. Cards to browse, list to scan many, map to see where things are.
          </p>
          <Figure src={`${SHOT}03-list.png`} alt="The list view: one row per listing" />
          <Figure src={`${SHOT}04-map.png`} alt="The map view: pins coloured by activity around Rotterdam, with the legend" />
          <FactList rows={VIEWS} />
        </Step>

        <Step n={4} title="Open, contact, or post">
          <p>
            A card opens the listing: its full text, photos, quantity and date, and the organisation behind
            it. <strong>Contact</strong> writes to that organisation as yours — see{" "}
            <Link to="/manual/$page" params={{ page: "send-a-message" }} className={link}>
              Send a message
            </Link>
            . And when nothing matches, the empty result says it: widen the radius, drop a filter, or be
            the one who posts it.
          </p>
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What you will not find</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        Closed listings and listings whose date has passed are not in the marketplace, though their links
        still open. There is no sorting yet — results come newest first — and no saved searches: the link
        in your address bar is the saved search.
      </p>
    </div>
  );
}
