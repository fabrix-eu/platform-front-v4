import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/follow-an-organisation/";

const CARDS = [
  ["Health", "Two ratings in the header, Economic and Environmental: Unknown, Excellent, Good, Warning, Critical. Yours to set; they colour the table and the map."],
  ["Notes", "Free text for your team, saved as you type."],
  ["Needs", "Ten kinds of need — financial support, technical expertise, market access, supply chain optimisation, regulatory compliance, sustainability consulting, digital transformation, talent acquisition, partnership opportunities, innovation support — each with a note. Press Assess to tick and annotate, Done to close."],
  ["Business data", "Specialisation, yearly turnover, employees, growth rate. Your figures, distinct from what the organisation declares on its own profile; saved when you leave a field."],
  ["Self-assessment", "Read-only: the organisation's own answers to the Compass questionnaire on needs and opportunities, if they filled it in."],
  ["People", "The organisation's members on FABRIX, with their email, and who owns the profile."],
  ["Tasks", "To-dos about this organisation; they also appear in the network's Tasks tab."],
  ["Interactions", "The log: a kind — call, email, meeting, visit, other — a date and a line on what happened. Newest first; each can be deleted."],
];

/** A how-to for the record a facilitator keeps on one organisation. */
export function FollowAnOrganisation() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        For each organisation you follow, the network keeps a record: how it is doing, what it needs, what
        you know, and what you did with it. Nothing in it is visible to the organisation. It is your working
        file, shared with your co-facilitators.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Open the record">
          <p>
            From the network's <strong>Organisations</strong> tab, click a row. The header shows the
            organisation as the platform knows it — type, address, what it does — with the two health
            ratings you set, a link to its public profile, and <strong>Unfollow</strong>.
          </p>
          <Figure src={`${SHOT}01-record.png`} alt="An organisation's record: the header with the two health ratings, then the Notes, Needs and other cards" />
        </Step>

        <Step n={2} title="Rate, note, assess">
          <p>
            Set <strong>Economic</strong> and <strong>Environmental</strong> from the header. Write in{" "}
            <strong>Notes</strong>. Press <strong>Assess</strong> on the Needs card to tick what this
            organisation needs and say a word about each; press <strong>Done</strong> when finished. Fill{" "}
            <strong>Business data</strong> with the figures you have.
          </p>
          <Figure src={`${SHOT}02-needs.png`} alt="The Needs card in Assess mode: ten needs to tick, each with a note" />
        </Step>

        <Step n={3} title="Log what you did">
          <p>
            Under <strong>Interactions</strong>, pick the kind, the date, type what happened and press
            Enter. The log is the memory of the relationship: the next facilitator to open the record knows
            where things stand.
          </p>
          <Figure src={`${SHOT}03-interactions.png`} alt="The Interactions card with one logged call" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The cards</Eyebrow>
      <FactList rows={CARDS} />

      <Banner tone="info" className="mt-10">
        <strong>Unfollow</strong> removes the organisation from the network and deletes this record — notes,
        needs, interactions — after a confirmation. The organisation itself, and its public profile, are
        untouched. The dashboard around this record is in{" "}
        <Link to="/manual/$page" params={{ page: "run-your-network" }} className={link}>
          Run your network
        </Link>
        .
      </Banner>
    </div>
  );
}
