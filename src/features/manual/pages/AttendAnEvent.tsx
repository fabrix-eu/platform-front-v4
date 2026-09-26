import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RSVP_LABELS, RSVP_STATUSES } from "@/features/events/types";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/attend-an-event/";

const FILTERS = [
  ["When", "Upcoming, the default, or Past. An event moves from one to the other at its date and time."],
  ["Location", "Near my organisation with a radius, or Everywhere, plus a country — the same rule as the marketplace. Online events are listed wherever you are, and have no pin on the map."],
  ["Views", "Cards, List, Map. Past events carry a Past badge."],
];

/** A how-to for finding events and answering them. */
export function AttendAnEvent() {
  const answers = RSVP_STATUSES.map((status) => RSVP_LABELS[status]).join(", ");
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Answering an event is one click, and it is the whole point: organisers see who is coming, and so
        does everyone else. Your answer is yours as a person, not your organisation's.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Find it">
          <p>
            <strong>Events</strong> in the sidebar lists what is coming up near your organisation. Search by
            words, switch to <strong>Past</strong>, widen the radius or pick a country.
          </p>
          <FactList rows={FILTERS} />
        </Step>

        <Step n={2} title="Answer">
          <p>
            On the event's page, under <strong>Are you coming?</strong>, three answers: {answers}. Click one;
            click it again to take it back. Change your mind any time — only the last answer counts.
          </p>
          <Figure src={`${SHOT}01-rsvp.png`} alt="An event page with the three answers Going, Maybe and Can't go, and nobody going yet" />
          <Figure src={`${SHOT}02-going.png`} alt="The same event after answering Going: the answer is highlighted and the going list shows one person" caption="Who is going is public to everyone signed in, up to the first eight faces." />
        </Step>

        <Step n={3} title="Get there">
          <p>
            An in-person event shows its address, and the map on the Events page places it. An online event
            shows <strong>Join online</strong>, the organiser's link — it is only shown to people signed in.
          </p>
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">Visitors</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        Anyone can read an event, without an account. Answering, seeing who else is going and getting the
        online link need one: the page says so and offers to sign up or sign in.
      </p>
      <Figure src={`${SHOT}03-visitor.png`} alt="The same event seen by a visitor: Join FABRIX to answer and see who else is going, with Get started and Sign in" />

      <Banner tone="info" className="mt-10">
        A past event still takes answers — as “you were there” — so it keeps a record of who came. To post
        one yourself, see{" "}
        <Link to="/manual/$page" params={{ page: "add-an-event" }} className={link}>
          Add an event
        </Link>
        .
      </Banner>
    </div>
  );
}
