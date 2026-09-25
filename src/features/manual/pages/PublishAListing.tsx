import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DIRECTION_META, ONE_OFF } from "@/features/listings/directions";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/publish-a-listing/";

const FIELDS = [
  ["Posted by", "Only when you belong to several organisations: the one the listing is published as. It cannot be changed afterwards."],
  ["Which way round is it? · required", `${DIRECTION_META.offering.label} or ${DIRECTION_META.needing.label}. From the profile's Offers & needs, the button you pressed already answered it.`],
  [ONE_OFF.label, `${ONE_OFF.hint} Shown as a badge; the marketplace can filter on it.`],
  ["What is it? · required", "One of five activities, then a Category from that activity — both required. A Speciality refines the category and is optional; “General” means none."],
  ["Title · required", "One line. What it is and how much: the form's example is the right shape."],
  ["Description · required", "What it is, its condition, how and where it can be collected or delivered. Searchable."],
  ["Quantity", "Free text, shown as typed — “300 kg per month”, “2 pallets”, “40 hours a week”."],
  ["Available until", "A date. When it passes, the listing leaves the marketplace by itself; it still opens by its link and from your profile, and a later date brings it back."],
  ["Photos", "JPG, PNG or WebP, several at once. Added after publishing if you picked them; you can add or remove more later."],
];

/** The rules of a listing: where the form opens, what each field means, what makes it valid. */
export function PublishAListing() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A listing is one thing you offer or one thing you need, filed in the vocabulary partners search
        by. This page is the rules; the step-by-step walk is{" "}
        <Link to="/manual/$page" params={{ page: "your-first-listing" }} className={link}>
          Your first listing
        </Link>
        .
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Start from where you are">
          <p>
            Three doors open the same form. <strong>Marketplace</strong> → <strong>Add a listing</strong>: a
            full page, asks everything. Your profile's <strong>D · Offers &amp; needs</strong> section →{" "}
            <strong>Add an offer</strong> or <strong>Add a need</strong>: a dialog, the direction already
            chosen. And your own public profile, which shows members an <strong>Add a listing</strong>{" "}
            button next to Edit profile — the same full page as the marketplace.
          </p>
          <Figure src={`${SHOT}02-offers-needs.png`} alt="The Offers & needs section of the profile editor: one offer on the marketplace, no needs yet, and the two Add buttons" caption="Offers and needs are the same listings, seen from your profile." />
          <Figure src={`${SHOT}03-add-a-need.png`} alt="The Add a need dialog: the one-off box, the activity, title, description, quantity, date and photos" />
        </Step>

        <Step n={2} title="Say who is posting, when it matters">
          <p>
            With more than one organisation, the form starts with <strong>Posted by</strong>. Everything
            about the listing — the Posted by card, the messages it brings, who may edit it — belongs to that
            organisation.
          </p>
          <Figure src={`${SHOT}01-posted-by.png`} alt="The top of the listing form for a member of two organisations, with the Posted by choice" />
        </Step>

        <Step n={3} title="Fill it in">
          <FactList rows={FIELDS} />
        </Step>

        <Step n={4} title="Publish">
          <p>
            <strong>Publish listing</strong> (or <em>Publish offer</em> / <em>Publish need</em> from the
            profile). A missing required field is pointed out in place; nothing is published until every
            one is there. The listing is live at once, status <em>Active</em>, and you land on it.
          </p>
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">Who can post</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        Any member of an organisation, owner or manager. A visitor sees <em>Join to post a listing</em>; a
        signed-in person without an organisation sees <em>Add your organisation to post</em>. Listings are
        never posted in a person's name.
      </p>

      <Banner tone="info" className="mt-10">
        Editing, closing, reopening and deleting are in{" "}
        <Link to="/manual/$page" params={{ page: "manage-your-listings" }} className={link}>
          Manage your listings
        </Link>
        ; the whole vocabulary of activities, categories and specialities is in{" "}
        <Link to="/manual/$page" params={{ page: "what-you-do" }} className={link}>
          What you do
        </Link>
        .
      </Banner>
    </div>
  );
}
