import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { STATUS_LABELS } from "@/features/compass/status";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/complete-the-compass/";

const STATUSES = [
  [STATUS_LABELS.not_started, "No answer yet. The card offers Start."],
  [STATUS_LABELS.in_progress, "Some answers saved. The card offers Continue, and the questionnaire reopens where you left it."],
  [STATUS_LABELS.completed, "Every question answered and scored. The card shows the score and offers Review; answering again updates it."],
];

const QUESTIONS = [
  ["One choice", "A row of options: click one. Most questions are this."],
  ["Several choices", "Boxes to tick, as many as apply."],
  ["A scale", "1 to 5, one click."],
  ["A grid", "Several statements against one scale, one choice per line."],
  ["Free text", "A short answer, or an email address."],
  ["Follow-ups", "Some questions only appear once another has been answered a certain way: the count of questions can grow as you go."],
];

/** A how-to for the Compass: one questionnaire at a time, saved as you go, read at the end. */
export function CompleteTheCompass() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        The Compass is a set of questionnaires on how your organisation works: ecodesign, environmental
        management, manufacturing, supply chain, and so on. Each takes a few minutes, saves itself as you
        answer, and ends with a score, a reading of it, and what to work on next. Only your team sees any
        of it.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Pick a questionnaire">
          <p>
            <strong>Compass</strong> in the sidebar, under your organisation's name. One card per
            questionnaire with its status, and at the top how many you have finished and your average
            score across them. Start with the one closest to what you do — a questionnaire that does not
            apply to you says so in its description.
          </p>
          <Figure src={`${SHOT}01-compass.png`} alt="The Compass page: the progress count and the questionnaire cards, each Not started with a Start button" />
        </Step>

        <Step n={2} title="Answer at your own pace">
          <p>
            Questions come in sections. Each answer is saved on its own, a moment after you give it — the
            line under the title says <em>Saved</em>, or that it could not save and your answers stay on the
            page. Leave whenever you like; <strong>Continue</strong> brings you back.
          </p>
          <Figure src={`${SHOT}02-form.png`} alt="A questionnaire with two answers given: the answered count, the Saved line, the first questions and the Where you are panel" caption="The panel on the right counts what is left; it turns into your result when nothing is." />
          <FactList rows={QUESTIONS} />
        </Step>

        <Step n={3} title="Read your result">
          <p>
            When the last question is answered, the panel shows your score out of 100 — with a few lines
            on what that range means, when the questionnaire carries them — and{" "}
            <strong>What to work on</strong>: the answers that cost you the most points, each with advice
            and, where there is one, a link to read further.{" "}
            <strong>Show more</strong> unfolds the rest, including what you are doing well.
          </p>
          <Figure src={`${SHOT}03-result.png`} alt="The result panel of a completed questionnaire: the score, its band, and the What to work on list" />
          <Figure src={`${SHOT}04-completed.png`} alt="The Compass page with one questionnaire completed: the score ring on its card and the progress count" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The three statuses</Eyebrow>
      <FactList rows={STATUSES} />

      <Eyebrow className="mt-12 mb-3">Who sees what</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        Your answers and scores are private to your organisation's team. The only exception is the
        questionnaire on needs and opportunities, which the facilitator of a network you belong to can read
        on your record — it is how they know where to help. Nothing about the Compass is shown on your
        public profile.
      </p>

      <Banner tone="info" className="mt-10">
        Questionnaires are written and published by the FABRIX team; when there is none yet, the page says
        so. What the scores mean, and why the questions are what they are, is in{" "}
        <Link to="/manual/$page" params={{ page: "the-impact-compass" }} className={link}>
          The Impact Compass
        </Link>
        .
      </Banner>
    </div>
  );
}
