import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ABOUT_VISUALISATION, CITY_CONFIG } from "@/features/data/cities";
import { FactList, proseLink as link } from "../parts";

const CONTROLS = [
  ["City", "Rotterdam or Athens, a tab each. Each has its own register, its own filters, its own map."],
  ["Activities", "The NACE categories the FABRIX team keeps for the textile chain, each with its colour. At least one must be ticked before the map draws; the count of businesses shown updates with the selection."],
  ["Year", "Rotterdam only: one of the snapshots of the register. Athens is a single, current snapshot."],
  ["Include secondary activities", "Athens only, on by default: match a business on any activity it declares, not only its main one."],
  ["Group into cells", "Hexagonal binning, about 500 metres a cell, sized by how many businesses it holds — density instead of overlapping dots. Off, every business is its own dot, clustered while zoomed out."],
  ["Popups", "A dot shows the business's name — and, in Rotterdam, its jobs. A cell shows how many businesses it holds."],
];

const RULES = [
  ["Who sees it", "Facilitators, the FABRIX team, and accounts without an organisation — viewers. Members of an organisation do not have the Data entry in their sidebar."],
  ["Shareable", "City, year, activities, cells and secondary-activity choice are all in the page's address: a view can be sent as a link."],
  ["Not on FABRIX", "These are registered businesses, not platform members. Nothing links a dot to a profile, and there is no export."],
];

/** Reference: the registers behind the Data page, rendered from the city definitions it uses. */
export function DataSources() {
  const cities = Object.values(CITY_CONFIG);
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        The Data page maps the textile and clothing businesses of two cities from their official registers
        — the whole population, on and off FABRIX — for the people who study or facilitate a territory.
        This page says where the data comes from and what the controls do.
      </p>

      {cities.map((city) => (
        <section key={city.key} aria-labelledby={`city-${city.key}`}>
          <Eyebrow id={`city-${city.key}`} className="mt-10 mb-3">
            {city.label} · source: {city.source}
          </Eyebrow>
          <FactList
            rows={[
              ...city.about.map((entry) => [entry.title, entry.body]),
              ...(city.years ? [["Years", city.years.join(", ")]] : []),
            ]}
          />
        </section>
      ))}

      <Eyebrow className="mt-12 mb-3">{ABOUT_VISUALISATION.title}</Eyebrow>
      <p className="text-fx-body text-fx-ink2">{ABOUT_VISUALISATION.body}</p>

      <Eyebrow className="mt-12 mb-3">The controls</Eyebrow>
      <FactList rows={CONTROLS} />

      <Eyebrow className="mt-12 mb-3">Rules</Eyebrow>
      <FactList rows={RULES} />

      <p className="mt-3 text-fx-label text-fx-muted">
        The texts about each register are the ones the page's “About the data” dialog shows, rendered from
        the same definitions.
      </p>

      <Banner tone="info" className="mt-10">
        Who has the Data entry, and why, is in{" "}
        <Link to="/manual/$page" params={{ page: "roles-and-permissions" }} className={link}>
          Roles and permissions
        </Link>
        ; what a facilitator does with a territory, in{" "}
        <Link to="/manual/$page" params={{ page: "facilitators-and-networks" }} className={link}>
          Facilitators and networks
        </Link>
        .
      </Banner>
    </div>
  );
}
