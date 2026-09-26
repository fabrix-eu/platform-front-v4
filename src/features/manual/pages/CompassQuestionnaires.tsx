import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { STATUS_LABELS } from "@/features/compass/status";
import { FIELD_TYPES, type FieldType } from "@/features/compass/types";
import { FactList, proseLink as link } from "../parts";

const TYPE_ROWS: Record<FieldType, [string, string]> = {
  select: ["One choice", "A row of options; one is picked. The option carries its points; the question is worth its best option."],
  multiselect: ["Several choices", "Boxes to tick. Points add up over the ticked options; the question is worth the sum of its positive ones."],
  rating: ["A scale", "1 to 5 by default. Scored as a whole, when the question carries points."],
  table: ["A grid", "Statements against one scale, one choice per line. Each line has its own points per value; the question is worth the best of every line."],
  text: ["Free text", "A short answer. Scored as a whole, when the question carries points; usually it does not."],
  email: ["An email address", "Checked for shape. Never scored."],
};

const STATUSES = [
  [STATUS_LABELS.not_started, "No answer saved yet — or the questionnaire was opened and left before the first answer."],
  [STATUS_LABELS.in_progress, "At least one answer saved, and at least one visible question still empty."],
  [STATUS_LABELS.completed, "Every visible question answered. Recomputed on every save: answering again keeps it completed, a follow-up question that appears takes it back to in progress until answered."],
];

const SCORE = [
  ["Points", "Every answer earns the points its option carries. The total is the sum over the questionnaire."],
  ["Out of what", "The sum of what every question is worth — minus the questions where you picked an option marked as not applicable. Saying a question does not apply never costs points."],
  ["Score", "Points divided by that maximum, as a percentage from 0 to 100, rounded when displayed. Hidden questions count neither way."],
  ["Average", "On the Compass page: the mean of your completed questionnaires' scores, over those only."],
  ["Result band", "When the FABRIX team has written bands for a questionnaire — a title and a text per range of scores — the panel shows the one your score falls in. Without bands, the score shows alone."],
  ["What to work on", "Every scored answer carries its own paragraph, written for that answer: what saying so means and what to do next. Ordered by how many points the answer left on the table, widest gap first; answers that scored full marks come last, under what you are doing well. Some carry a link to read further."],
];

const RULES = [
  ["Follow-up questions", "A question can depend on another's answer: it appears only when that answer matches. Until then it is neither asked nor counted."],
  ["Saving", "Each change is saved on its own a moment later; a save that fails keeps your answers on the page and says so. There is no submit."],
  ["One answer per questionnaire", "Your organisation has one set of answers per questionnaire; reopening it edits that set. The most recent set is the one shown."],
  ["Who sees it", "Your team. A facilitator following you reads one questionnaire, on needs and opportunities. Nothing is public."],
];

/** Reference: how a Compass questionnaire is built, saved, scored and read. */
export function CompassQuestionnaires() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A questionnaire is sections of questions, written and published by the FABRIX team. Each question
        has a type, may carry points, and may depend on another. This page is the mechanics: what the
        types are, how a status is decided, how the score is computed and what the result panel shows.
      </p>

      <Eyebrow className="mt-10 mb-3">The {FIELD_TYPES.length} question types</Eyebrow>
      <FactList rows={FIELD_TYPES.map((type) => TYPE_ROWS[type])} />

      <Eyebrow className="mt-12 mb-3">The three statuses</Eyebrow>
      <FactList rows={STATUSES} />

      <Eyebrow className="mt-12 mb-3">The score</Eyebrow>
      <FactList rows={SCORE} />

      <Eyebrow className="mt-12 mb-3">Rules</Eyebrow>
      <FactList rows={RULES} />

      <Banner tone="info" className="mt-10">
        Answering one is in{" "}
        <Link to="/manual/$page" params={{ page: "complete-the-compass" }} className={link}>
          Complete the Compass
        </Link>
        ; what the Compass is for, in{" "}
        <Link to="/manual/$page" params={{ page: "the-impact-compass" }} className={link}>
          The Impact Compass
        </Link>
        .
      </Banner>
    </div>
  );
}
