import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/run-your-network/";

const TABS = [
  ["Overview", "The network's description, three numbers — organisations followed, open tasks, overdue — the next tasks up, and the territory: its centre, its radius, who runs it."],
  ["Organisations", "The organisations you follow: a table, cards, a map of their addresses over your territory, or a graph of the connections between them. Filters by type, speciality, economic health, country and workforce."],
  ["Tasks", "Your team's to-do list for the network, with due dates. Overdue ones are in red; tick them done. Tasks about one organisation also show on its record."],
  ["Team", "Who has facilitator access, the people at the organisation the network is linked to who could be granted it, pending invitations, and the way to invite a co-facilitator by email."],
  ["Settings", "Name, description, the linked organisation, the territory's centre and radius. The address of the network cannot be changed once created."],
];

/** A how-to for facilitators: the network dashboard and its five tabs. */
export function RunYourNetwork() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A network is a facilitator's own view of a territory: the organisations they follow, what they know
        about each one, and what they have to do next. It is private to the facilitation team — nothing in
        it is shown to the organisations or to the rest of FABRIX. This page is the dashboard; the record
        of one organisation is the next chapter.
      </p>

      <Banner tone="info" label="Facilitators" className="mt-6">
        Networks appear in the sidebar under <strong>Facilitator</strong>, one entry each, for the people
        given access to them. A network is set up by the FABRIX team; if you have none, the page says whom
        to write to.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Start on the overview">
          <p>
            Your network's name in the sidebar opens it on <strong>Overview</strong>: the numbers, what is
            next up, and the territory. The colour tint of these pages tells you at a glance that you are
            in the facilitator's space, not in an organisation's.
          </p>
          <Figure src={`${SHOT}01-overview.png`} alt="The network dashboard's Overview: organisations followed, open tasks, overdue, the next tasks and the territory" />
        </Step>

        <Step n={2} title="Work the list of organisations">
          <p>
            <strong>Organisations</strong> is the CRM. The table carries the columns you keep on each
            organisation — economic and environmental health, employees, specialisation, the number of needs
            identified — and a click opens its record. The map draws them over your territory, the graph
            draws the connections declared between them.
          </p>
          <Figure src={`${SHOT}02-organisations.png`} alt="The Organisations tab: filters on the left, the table with health, employees, specialisation and needs" />
          <Figure src={`${SHOT}03-map.png`} alt="The same organisations on the map, over the network's territory" />
        </Step>

        <Step n={3} title="Keep the to-do list">
          <p>
            <strong>Tasks</strong>: type a title, pick a due date, <strong>Add</strong>. Switch between{" "}
            <strong>To do</strong> and <strong>Done</strong>; tick a task to move it. A task created from an
            organisation's record is labelled with that organisation here.
          </p>
          <Figure src={`${SHOT}04-tasks.png`} alt="The Tasks tab: an overdue task in red, two upcoming ones, one labelled with its organisation" />
        </Step>

        <Step n={4} title="Bring in a co-facilitator">
          <p>
            <strong>Team</strong> lists who has access. Invite a colleague by email; someone who already has
            an account at the network's linked organisation can simply be granted access. The creator of the
            network and its last member cannot be removed.
          </p>
          <Figure src={`${SHOT}05-team.png`} alt="The Team tab: who has facilitator access, and the form to invite a co-facilitator" />
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">The five tabs</Eyebrow>
      <FactList rows={TABS} />

      <Banner tone="info" className="mt-10">
        What you keep on one organisation — health, notes, needs, business data, interactions — is in{" "}
        <Link to="/manual/$page" params={{ page: "follow-an-organisation" }} className={link}>
          Follow an organisation
        </Link>
        . Adding an organisation to a network is done by the FABRIX team for now.
      </Banner>
    </div>
  );
}
