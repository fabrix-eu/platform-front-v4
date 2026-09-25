import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { DIRECTION_META, ONE_OFF } from "@/features/listings/directions";
import { LISTING_TYPE_META, LISTING_TYPES } from "@/features/listings/taxonomy";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/your-first-listing/";

const WHERE = [
  ["The marketplace", "Everyone who opens it. By default it shows what is within 100 km of the reader's organisation, so your neighbours see it first; “Everywhere” shows it to all."],
  ["Your profile", "Its Listings section, on the public page every visitor can read."],
  ["The feeds around you", "The home page of organisations near yours lists what was posted around them, and your listing is now one of those things."],
];

/**
 * A tutorial: one path, walked once, that ends with something real — a listing
 * live on the marketplace. Labels come from the modules the form uses; the
 * screenshots were taken on the form itself.
 */
export function YourFirstListing() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        In about ten minutes you will have a listing live on the marketplace, where the organisations
        around you find it and write to you. We post an offer — some material you have too much of. A need
        works exactly the same way, with one answer flipped.
      </p>

      <Banner tone="info" label="Before you start" className="mt-6">
        You need an organisation on FABRIX. If the marketplace button reads “Add your organisation to
        post”, go back to{" "}
        <Link to="/manual/$page" params={{ page: "getting-started" }} className={link}>
          Getting started
        </Link>{" "}
        first.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Open the form">
          <p>
            Choose <strong>Marketplace</strong> in the sidebar, then <strong>Add a listing</strong>, under
            the title. You get a single page with one form on it.
          </p>
          <Figure src={`${SHOT}01-marketplace.png`} alt="The marketplace page, with the Add a listing button under its title" caption="The marketplace, as a member sees it." />
          <p>
            There is a second door: your profile's <strong>Offers &amp; needs</strong> section, with{" "}
            <strong>Add an offer</strong> and <strong>Add a need</strong>. It opens the same form in a
            dialog, minus the question the button already answered.
          </p>
        </Step>

        <Step n={2} title="Say which way round it is">
          <p>
            The first question is <strong>Which way round is it?</strong> Pick{" "}
            <strong>{DIRECTION_META.offering.label}</strong>. The other answer,{" "}
            <em>{DIRECTION_META.needing.label}</em>, is the whole difference between an offer and a need.
          </p>
          <p>
            Below it, <strong>{ONE_OFF.label}</strong>: {ONE_OFF.hint} Our material comes back every
            month, so leave it unticked.
          </p>
          <Figure src={`${SHOT}02-direction.png`} alt="The offered-or-wanted choice and the one-off checkbox" />
        </Step>

        <Step n={3} title="File it where partners will look">
          <p>
            <strong>What is it?</strong> is one of five activities:
          </p>
          <div className="flex flex-wrap gap-2">
            {LISTING_TYPES.map((type) => (
              <Badge key={type} tone={LISTING_TYPE_META[type].tone}>
                {LISTING_TYPE_META[type].label}
              </Badge>
            ))}
          </div>
          <p>
            Pick <strong>Materials</strong>. A <strong>Category</strong> list appears; choose the closest
            one, then refine it with a <strong>Speciality</strong> if one fits — “General” is fine when
            none does. This is the same vocabulary as{" "}
            <Link to="/manual/$page" params={{ page: "what-you-do" }} className={link}>
              What you do
            </Link>
            : a partner filtering the marketplace by a category finds your listing with it.
          </p>
          <Figure src={`${SHOT}03-activity.png`} alt="Materials selected, with the Category and Speciality lists below" caption="Materials, filed under Waste streams." />
        </Step>

        <Step n={4} title="Describe it the way you would on the phone">
          <p>
            <strong>Title</strong>: what it is and how much, in one line — the form suggests “Organic
            cotton roll-ends — 500 kg a month”, and that is the right shape. <strong>Description</strong>:
            what it is, its condition, and how and where it can be collected or delivered.
          </p>
          <p>
            <strong>Quantity</strong> and <strong>Available until</strong> are optional. Both are shown on
            the listing as they are; a date does not close the listing by itself when it passes.
          </p>
          <Figure src={`${SHOT}04-describe.png`} alt="Title, description, quantity and available-until fields, filled in" />
        </Step>

        <Step n={5} title="Add a photo or two">
          <p>
            Optional, and worth it: a listing with a photo is the one people open. JPG, PNG or WebP. You
            can add or remove photos later from <strong>Edit listing</strong>.
          </p>
          <Figure src={`${SHOT}05-photos.png`} alt="The Photos field with its Add button" />
        </Step>

        <Step n={6} title="Publish">
          <p>
            Press <strong>Publish listing</strong>. You land on your listing's page, as a partner will see
            it: the badges at the top ({DIRECTION_META.offering.badge}, the activity and category), your
            photos, your text, and a <strong>Posted by</strong> card that links to your profile.
          </p>
          <Figure src={`${SHOT}06-published.png`} alt="The published listing page, with its badges, text, details and the Posted by card" caption="Published. Edit listing and Delete listing are yours alone." />
          <p>If a field is missing, the form says which one, in place. Fix it and publish again.</p>
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">Where it now shows up</Eyebrow>
      <FactList rows={WHERE} />

      <Eyebrow className="mt-12 mb-3">What happens next</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        A partner who is interested presses <strong>Contact</strong> on your listing. Their message arrives
        in your organisation's <strong>Messages</strong>, and anyone on your team can answer it. When the
        material is gone, open the listing, choose <strong>Edit listing</strong> and set its status to
        Closed: it leaves the marketplace but stays yours, ready to reopen next month.
      </p>

      <Banner tone="info" className="mt-10">
        One listing tells the network what you have. The next walk,{" "}
        <Link to="/manual/$page" params={{ page: "bring-your-partners" }} className={link}>
          Bring your partners
        </Link>
        , tells it who you work with — which is how the people who should see your listing get here.
      </Banner>
    </div>
  );
}
