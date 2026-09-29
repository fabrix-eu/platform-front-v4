import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CITY_CONFIG, ROTTERDAM_YEARS } from "@/features/data/cities";
import { Figure } from "../Figure";
import { FactList, proseLink as link, Step } from "../parts";

const SHOT = "/manual/explore-the-data/";

const READ = [
  ["The count", "Above the map: how many businesses match the activities you ticked, for that city and year. It is the number to quote."],
  ["A dot", "One registered business at its own address. Zoomed out, dots close together cluster into one with a number; zoom in to split them. Click a dot for the name — and, in Rotterdam, the jobs."],
  ["A cell", "With Group into cells on: a hexagon of about 500 metres, sized by how many businesses it holds. Click it for the count. Density, when dots would pile up."],
  ["The colours", "Each activity has its own, shown in the list on the left. A business with several activities takes the colour of the first one you ticked."],
];

const USES = [
  ["Where is the industry", "Tick the activities that make the chain — production, wholesale, retail — and read the map: the districts, the port, the quiet zones."],
  ["How it moved", "Rotterdam only: keep the same activities and step through the years. The register is a series of snapshots; what disappears between two is as telling as what appears."],
  ["Who is not on FABRIX yet", "The registers are the whole population; the Directory is the members. A dense cell with no FABRIX profile nearby is a place to go and knock."],
  ["Sharing a view", "Everything you set is in the page's address. Copy it and the colleague opens the same city, year, activities and mode."],
];

/** A how-to for the Data page: drawing the industry of a pilot city from its business register. */
export function ExploreTheData() {
  const rotterdam = CITY_CONFIG.rotterdam;
  const athens = CITY_CONFIG.athens;
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        The Data page draws every registered textile and clothing business of a pilot city on a map —
        members of FABRIX or not — from the city's official register. It is for the people who study or
        facilitate a territory: where the industry sits, how it moved, and where the network still has
        gaps.
      </p>

      <Banner tone="info" label="Who has it" className="mt-6">
        <strong>Data</strong> appears in the sidebar, under Resources, for facilitators, the FABRIX team
        and accounts without an organisation. Members of an organisation do not see it. The public{" "}
        <strong>Data</strong> page, in the top bar next to the manual, presents the datasets to everyone and
        takes requests for extracts; the map behind it is this page.
      </Banner>

      <ol className="mt-8 flex flex-col gap-4">
        <Step n={1} title="Pick a city">
          <p>
            Two tabs: <strong>{rotterdam.label}</strong>, from the {rotterdam.source} register, at{" "}
            {ROTTERDAM_YEARS.length} points in time; <strong>{athens.label}</strong>, from {athens.source},
            a single current snapshot. The badges under the tabs repeat the place, the source and, for
            Rotterdam, the year. The map stays empty until you tick an activity.
          </p>
          <Figure src={`${SHOT}01-data.png`} alt="The Data page on Rotterdam: the city tabs, the year, the activities to tick, and the empty map asking for an activity" />
        </Step>

        <Step n={2} title="Tick the activities">
          <p>
            The list on the left is the industry's classification — the NACE categories the FABRIX team
            keeps for the textile chain — each with its colour. Tick one or several; the count and the map
            follow. <strong>Clear activities</strong> empties the selection.
          </p>
          <Figure src={`${SHOT}02-dots.png`} alt="Athens with three activities ticked: coloured dots across the city, clustered where they are close, and the count above the map" caption="Three activities ticked on Athens: the count follows, and every business is a dot at its address." />
        </Step>

        <Step n={3} title="Choose how to look">
          <p>
            <strong>Group into cells</strong> turns the dots into hexagons of density: better when a district
            holds hundreds of addresses. In Rotterdam, <strong>Year</strong> redraws the map as the register
            stood that year. In Athens, <strong>Include secondary activities</strong>, on by default, also
            counts businesses that declare the work as a side activity; untick it to keep only those whose
            main activity it is.
          </p>
          <Figure src={`${SHOT}03-cells.png`} alt="The same selection on Athens with Group into cells on: cells sized by how many businesses they hold, each with its count" />
        </Step>

        <Step n={4} title="Read it">
          <FactList rows={READ} />
          <p>
            <strong>About the data</strong>, top right, explains the register and the map in the same words
            as the reference chapter.
          </p>
        </Step>
      </ol>

      <Eyebrow className="mt-12 mb-3">What to do with it</Eyebrow>
      <FactList rows={USES} />

      <Eyebrow className="mt-12 mb-3">What it is not</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        The dots are registered businesses, not FABRIX profiles: nothing links a dot to a page, and a
        business on the map may well be on the Directory under its own name. There is no export and no
        table view: the map and its count are the whole of it.
      </p>

      <Banner tone="info" className="mt-10">
        Where the two registers come from and what they cover is in{" "}
        <Link to="/manual/$page" params={{ page: "data-sources" }} className={link}>
          Data sources
        </Link>
        ; what a facilitator does with a territory, in{" "}
        <Link to="/manual/$page" params={{ page: "run-your-network" }} className={link}>
          Run your network
        </Link>
        .
      </Banner>
    </div>
  );
}
