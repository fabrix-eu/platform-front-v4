import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/manage-your-listings/";

const STATES = [
  ["Active", "Shown in the marketplace, on your profile and in the feeds around you. The state every listing is published in."],
  ["Closed", "Hidden from the marketplace, still yours: it stays on your profile's Offers & needs, keeps its photos and text, and can be set back to Active any time. The right move when the material is gone for now."],
  ["Past its date", "An Active listing whose Available until has passed leaves the marketplace by itself. Nothing changes on the listing; a later date, or no date, brings it back."],
  ["Deleted", "Gone from everywhere, with its photos. There is no undo — close instead when in doubt."],
];

/** A how-to for the life of a listing after publishing: edit, close, reopen, delete. */
export function ManageYourListings() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A listing is never finished: quantities change, the material runs out, a photo would help. Everything
        about it can be changed after publishing, by any member of the organisation that posted it. Two
        places do it — the listing itself, and your profile.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="From the listing">
          <p>
            Open it from the marketplace or your profile. As a member of the posting organisation, its side
            card shows <strong>Edit listing</strong> and <strong>Delete listing</strong> instead of Contact.
            Edit opens the full form with one field more: <strong>Status</strong>.
          </p>
          <Figure src="/manual/your-first-listing/06-published.png" alt="A listing seen by a member of the posting organisation, with Edit listing and Delete listing in the side card" />
          <Figure src={`${SHOT}02-edit-status.png`} alt="The end of the edit form: the Status choice, the photos with their remove buttons, and Save changes" caption="Status is only asked when editing — a listing is always published Active." />
        </Step>

        <Step n={2} title="From your profile">
          <p>
            In the editor, <strong>D · Offers &amp; needs</strong> lists every listing under offers or needs,
            each with <strong>Edit</strong> and a bin. Edit opens the same form in a dialog, with{" "}
            <strong>Delete</strong> at its foot; nothing else is saved until you press{" "}
            <strong>Save changes</strong>.
          </p>
          <Figure src={`${SHOT}01-edit-dialog.png`} alt="The edit dialog opened from the profile, with the same fields and the Status choice" />
        </Step>

        <Step n={3} title="Photos">
          <p>
            In the edit form, existing photos carry a remove button and <strong>Add</strong> takes new ones.
            Adding uploads at once; removing is immediate too — neither waits for Save changes.
          </p>
        </Step>

        <Step n={4} title="Close, reopen, delete">
          <p>
            Set <strong>Status</strong> to <em>Closed</em> and save: the listing leaves the marketplace and
            shows a <em>Closed</em> badge to anyone who still has its link. Set it back to <em>Active</em>{" "}
            to reopen. <strong>Delete listing</strong> asks you to confirm, naming the listing, and cannot
            be undone.
          </p>
          <Figure src={`${SHOT}03-closed.png`} alt="A closed listing: the Closed badge next to the others at the top of the page" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The four states</Eyebrow>
      <FactList rows={STATES} />

      <Banner tone="info" className="mt-10">
        Keep listings honest rather than many: a closed listing reopened next month tells partners more
        than a new one each time. The fields and their rules are in{" "}
        <Link to="/manual/$page" params={{ page: "publish-a-listing" }} className={link}>
          Publish a listing
        </Link>
        .
      </Banner>
    </div>
  );
}
