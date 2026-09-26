import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/add-an-event/";

const FIELDS = [
  ["What is it? · required", "The title, two characters at least. Say the format and the subject: “Repair café — bring your jeans”."],
  ["When? · required", "Date and time. Events are sorted by it, and it decides when the event moves from Upcoming to Past."],
  ["What happens there?", "Who it is for, what to bring, how to get in. Optional, but it is what people read before answering."],
  ["This one happens online", "A switch. On, the address gives way to Where do people join?, a link — public to anyone signed in who opens the event. Off, an Address picked from the suggestions is required: it puts the event on the map."],
];

/** A how-to for putting an event in front of the whole network. */
export function AddAnEvent() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Events are global: a workshop, a fair, an open day or an online meet-up, visible to everyone on
        FABRIX and to visitors, with a place on the map when it has an address. Any member of an
        organisation can add one, in a minute.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Open Events and press Add an event">
          <p>
            <strong>Events</strong> in the sidebar. The button under the title reads{" "}
            <strong>Add an event</strong> for a member; a visitor sees <em>Join to add an event</em> and
            someone without an organisation <em>Add your organisation to post</em>.
          </p>
          <Figure src={`${SHOT}01-events.png`} alt="The Events page: the Add an event button, the When and Location filters, the upcoming events" />
        </Step>

        <Step n={2} title="Fill in the dialog">
          <FactList rows={FIELDS} />
          <Figure src={`${SHOT}02-add-dialog.png`} alt="The Add an event dialog: title, date and time, description, the online switch and the address on the map" />
        </Step>

        <Step n={3} title="Publish">
          <p>
            <strong>Publish event</strong> opens the event's page as everyone will see it. From then on it
            is in the Events list for everyone, on the map, and in the home-page feed of the organisations
            around it.
          </p>
          <Figure src={`${SHOT}03-event-creator.png`} alt="The published event as its creator sees it: Edit event and Delete above the RSVP buttons, nobody going yet" caption="Edit event and Delete are yours, as the person who created it — and the FABRIX team's." />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">Afterwards</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        <strong>Edit event</strong> reopens the same dialog; <strong>Delete</strong> asks you to confirm and
        removes the event and its answers. Only the person who created the event can do either — not the
        rest of their organisation — plus the FABRIX team. The event stays listed under <em>Past</em> once
        its date has gone by, with everyone who said they were there.
      </p>

      <Banner tone="info" className="mt-10">
        Events have no photo yet, and no organiser other than the person who posted them. To see how people
        answer, read{" "}
        <Link to="/manual/$page" params={{ page: "attend-an-event" }} className={link}>
          Attend an event
        </Link>
        .
      </Banner>
    </div>
  );
}
