import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/send-feedback/";

const KINDS = [
  ["Something is broken", "A page that fails, a button that does nothing, a number that is wrong. Say what you did, what happened, and what you expected instead."],
  ["I have an idea", "Something the platform could do, or do better. The North Star is that members bring their partners: ideas that make that easier get read first."],
  ["I have a question", "Something the manual did not answer. The team has your email to answer."],
];

const SENT = [
  ["Your words", "The message as you wrote it, under the kind you chose."],
  ["Where you were", "The address of the page you sent it from, so the team can go and look. Send it from the page the problem is on."],
  ["The screenshot", "If you attached one. A picture of a broken page is worth the whole description."],
  ["Who you are", "Your name and email, so they can answer. Feedback is never anonymous, and never public."],
];

/** A how-to for the feedback panel: what to send, from where, and what happens to it. */
export function SendFeedback() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        FABRIX is built with the people who use it. A <strong>Feedback</strong> button sits in the corner of
        every page once you are signed in; what you send goes straight to the FABRIX team, with the page
        you were on.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Press Feedback, on the page it is about">
          <p>
            Top right on a computer, bottom of the screen on a phone. It is only there when you are signed
            in — visitors write to the team through the project site.
          </p>
          <Figure src={`${SHOT}01-button.png`} alt="The Feedback button in the top right corner of a page" />
        </Step>

        <Step n={2} title="Say what kind, then tell it">
          <p>
            A panel opens on the side, over the page. <strong>What is this about?</strong> — one of three
            kinds. <strong>Tell us</strong> — the message, required; rough notes are welcome.{" "}
            <strong>Screenshot</strong> — optional: pick an image, see it, remove it if it is the wrong one.
            The panel says which page it will record. Then <strong>Send feedback</strong>.
          </p>
          <Figure src={`${SHOT}02-panel.png`} alt="The feedback panel: the kind, the message, and the screenshot field" />
          <FactList rows={KINDS} />
        </Step>

        <Step n={3} title="Done">
          <p>
            A short confirmation, and the panel closes. There is nothing to track on the platform: the
            team reads feedback in its admin and comes back to you by email when there is something to say.
          </p>
          <Figure src={`${SHOT}03-toast.png`} alt="The confirmation: Thanks — your feedback reached the team." />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What is sent</Eyebrow>
      <FactList rows={SENT} />

      <Banner tone="info" className="mt-10">
        Feedback is for the platform. For a question about another organisation, write to them — see{" "}
        <Link to="/manual/$page" params={{ page: "send-a-message" }} className={link}>
          Send a message
        </Link>
        .
      </Banner>
    </div>
  );
}
