import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/send-a-message/";

const RULES = [
  ["Organisation to organisation", "A conversation is between two organisations. You write as yours; anyone on their team can read and answer, and so can anyone on yours. Nothing is addressed to a person."],
  ["Managed profiles only", "An unclaimed profile has nobody to read it: its Message button is not there. Connect to it, or invite its team, instead."],
  ["Send as", "With several organisations, the dialog asks which one is writing; the mailbox of each organisation is its own, under Messages in the sidebar."],
  ["You are told", "A new message shows as a count next to Messages in the sidebar, refreshed every minute, and reaches your email. Opening the conversation marks it read for your whole team."],
  ["No organisation", "Messages in the sidebar is greyed out, with the reason: without an organisation there is nobody to write as."],
];

/** A how-to for the messaging: where a conversation starts, how it goes on, and who is speaking. */
export function SendAMessage() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Messages on FABRIX travel between organisations, not people. You start one from the other
        organisation's profile or from one of its listings; it continues in <strong>Messages</strong>, where
        your whole team can pick it up.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Start from a profile or a listing">
          <p>
            On a managed organisation's profile, press <strong>Message</strong>. On a listing, press{" "}
            <strong>Contact</strong>: the message opens with a greeting that names the listing, so they know
            what you are writing about. Write, then <strong>Send</strong>.
          </p>
          <Figure src={`${SHOT}01-message-dialog.png`} alt="The Message dialog opened from a profile, with the message written" caption="From a listing, the first line names the listing for you." />
        </Step>

        <Step n={2} title="Carry on in Messages">
          <p>
            <strong>Messages</strong>, under your organisation's name in the sidebar, is its mailbox:
            conversations on the left with their unread count, the thread on the right. Each message shows
            who wrote it and for which organisation. Type at the bottom; <strong>Enter</strong> sends,{" "}
            <strong>Shift+Enter</strong> starts a new line.
          </p>
          <Figure src={`${SHOT}02-thread.png`} alt="The Messages page of the receiving organisation: the conversation list, the thread with both sides, and the composer" caption="The reply goes out as the organisation, signed by the person who typed it." />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The rules</Eyebrow>
      <FactList rows={RULES} />

      <Banner tone="info" className="mt-10">
        A message is the end of the marketplace's loop: someone found your listing, and now you are
        talking. Keep the listing up to date so the next message is about something you still have — see{" "}
        <Link to="/manual/$page" params={{ page: "manage-your-listings" }} className={link}>
          Manage your listings
        </Link>
        .
      </Banner>
    </div>
  );
}
