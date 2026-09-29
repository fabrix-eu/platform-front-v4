import type { User } from "@/lib/auth";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { type DataSummary, formatCount } from "./api";
import { ExploreActions } from "./ExploreActions";

function figures(summary: DataSummary): [string, string][] {
  return [
    [formatCount(summary.datasets.rotterdam.rows), "Rotterdam establishment-years"],
    [formatCount(summary.datasets.athens.rows), "Athens companies"],
    [formatCount(summary.network.organizations), "organisations on FABRIX"],
    [formatCount(summary.network.relations), "relations between them"],
  ];
}

/** The still of the map, the promise, and the way in. The live map stays for members. */
export function DataHero({ summary, me }: { summary: DataSummary; me?: User }) {
  return (
    <section aria-labelledby="data-title">
      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <Eyebrow className="text-fx-emphasis">Data</Eyebrow>
          <h1 id="data-title" className="mt-3 max-w-[16ch] font-fx-display text-fx-hero text-fx-ink">
            The textile industry of two cities, on a map
          </h1>
          <p className="mt-5 max-w-xl text-fx-lead text-fx-ink2">
            Every registered textile and clothing business of Rotterdam and Athens, from their official registers, members
            of FABRIX or not. Behind it, a national employment series, a company database and the network itself. For the
            people who study, plan or steer a territory.
          </p>
          <div className="mt-8">
            <ExploreActions me={me} />
          </div>
        </div>
        <figure className="overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper">
          <img src="/data/map-still.png" alt="The Rotterdam map with three activities selected: clusters of businesses across the city, each with its count" className="aspect-square w-full object-cover" />
          <figcaption className="border-t border-fx-line px-4 py-3 text-fx-small text-fx-muted">
            Rotterdam, 2022, three activities ticked. Members pick the city, the year and the activities.
          </figcaption>
        </figure>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {figures(summary).map(([value, label]) => (
          <div key={label} className="rounded-fx-lg border border-fx-line bg-fx-paper p-5">
            <dd className="font-fx-display text-fx-display text-fx-ink tabular-nums">{value}</dd>
            <dt className="mt-1 text-fx-small text-fx-muted">{label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
