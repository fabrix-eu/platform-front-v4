import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DIRECTION_META, DIRECTIONS, ONE_OFF } from "@/features/listings/directions";
import { LISTING_TYPE_META, LISTING_TYPES } from "@/features/listings/taxonomy";
import { FactList, proseLink as link } from "../parts";

/** Every field, in the form's order: name, whether it is required, and what reads it. */
const FIELDS: [string, string, string][] = [
  ["Posted by", "required", "The organisation the listing belongs to. Chosen once, when there are several; never changed after."],
  ["Which way round is it?", "required", `${DIRECTIONS.map((d) => DIRECTION_META[d].label).join(" or ")}. Shown as the ${DIRECTIONS.map((d) => DIRECTION_META[d].badge).join(" / ")} badge; the marketplace filters on it.`],
  [ONE_OFF.label, "yes or no", `${ONE_OFF.hint} Shown as a ${ONE_OFF.badge} badge; the Timing filter reads it.`],
  ["What is it?", "required", "One of the five activities below. Shown as a badge; the Activity filter reads it."],
  ["Category", "required", "One category of that activity. Shown after the badges; the Category filter reads it."],
  ["Speciality", "optional", "One speciality of that category, or General. Shown with the category; the Speciality filter reads it."],
  ["Title", "required", "One line. Searched by the marketplace's search box, with the description."],
  ["Description", "required", "Free text, any length. Searched as well."],
  ["Quantity", "optional", "Free text, shown as typed on the listing."],
  ["Available until", "optional", "A date. Shown on the listing; once past, the listing leaves the marketplace by itself."],
  ["Photos", "optional", "JPG, PNG or WebP, several. The first is the card's picture; all open in the gallery."],
  ["Status", "edit only", "Active or Closed. A listing is published Active."],
];

const STATES = [
  ["Active", "In the marketplace, on the profile, in the feeds — as long as its date, if any, is not past."],
  ["Active, date past", "Off the marketplace, still on the profile and by its link. A later date, or none, puts it back."],
  ["Closed", "Off the marketplace, still on the profile's Offers & needs and by its link, with a Closed badge. Set to Active to reopen."],
  ["Deleted", "Gone, with its photos. No undo."],
];

const READ = [
  ["Address and country", "Not on the listing: the marketplace's distance and country filters read the posting organisation's address."],
  ["Who posted", "The Posted by card names the organisation, links to its profile, and carries its address."],
  ["Order", "Newest first, everywhere."],
];

/** Reference: the anatomy of a listing, from the modules the form is built on. */
export function ListingFields() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A listing is one offer or one need, posted by an organisation. This page lists its fields, what
        each one is for, and the states it can be in — with the labels the form uses.
      </p>

      <Eyebrow className="mt-10 mb-3">The five activities</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {LISTING_TYPES.map((type) => (
          <Badge key={type} tone={LISTING_TYPE_META[type].tone}>
            {LISTING_TYPE_META[type].label}
          </Badge>
        ))}
      </div>
      <p className="mt-3 text-fx-body text-fx-ink2">
        Each activity has its categories, and each category its specialities: the same three-level
        vocabulary as an organisation's What you do, listed in full in{" "}
        <Link to="/manual/$page" params={{ page: "what-you-do" }} className={link}>
          What you do
        </Link>
        . The category must belong to the activity, and the speciality to the category; the form only
        offers the ones that do.
      </p>

      <Eyebrow className="mt-12 mb-3">The fields</Eyebrow>
      <div className="overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper">
        <table className="w-full text-fx-small">
          <thead>
            <tr className="border-b border-fx-line bg-fx-panel font-fx-display text-fx-label text-fx-muted uppercase">
              <th className="px-4 py-3 text-left font-normal">Field</th>
              <th className="px-2 py-3 text-left font-normal">Required</th>
              <th className="px-4 py-3 text-left font-normal">What it is, and who reads it</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map(([name, required, what]) => (
              <tr key={name} className="border-b border-fx-line align-top last:border-b-0">
                <td className="px-4 py-2.5 font-bold text-fx-ink">{name}</td>
                <td className="px-2 py-2.5 whitespace-nowrap text-fx-muted">{required}</td>
                <td className="px-4 py-2.5 text-fx-ink2">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Eyebrow className="mt-12 mb-3">The states</Eyebrow>
      <FactList rows={STATES} />

      <Eyebrow className="mt-12 mb-3">What is not a field</Eyebrow>
      <FactList rows={READ} />

      <Banner tone="info" className="mt-10">
        How to fill the form is in{" "}
        <Link to="/manual/$page" params={{ page: "publish-a-listing" }} className={link}>
          Publish a listing
        </Link>
        ; how to change a listing afterwards, in{" "}
        <Link to="/manual/$page" params={{ page: "manage-your-listings" }} className={link}>
          Manage your listings
        </Link>
        .
      </Banner>
    </div>
  );
}
