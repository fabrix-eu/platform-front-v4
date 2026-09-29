import { ABOUT_VISUALISATION, CITIES, CITY_CONFIG } from "../cities";

const LIMITS = [
  ["A dot is a registered business", "not a FABRIX profile. Nothing links one to the other, and a business on the map may be on the Directory under its own name."],
  ["Registers change scope", "between two snapshots the register may have widened or narrowed what it records, so part of a rise or a fall is coverage, not industry."],
  ["An activity code says what a business declared", "not everything it does. Athens lets a business match on its secondary codes; Rotterdam records one."],
  ["Addresses are geocoded", "and a few land on the wrong block. Cells absorb that; single dots do not."],
  ["Nothing personal is shown", "the registers hold contact details and jobs by gender; the platform never exposes them, on the map or in the figures."],
] as const;

/** Where the data comes from, in the words the map's own "About the data" uses, and what to keep in mind. */
export function SourcesAndLimits() {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      <div className="grid gap-4">
        {CITIES.map((key) => {
          const city = CITY_CONFIG[key];
          return (
            <div key={key} className="rounded-fx-lg border border-fx-line bg-fx-paper p-5">
              <h3 className="font-fx-display text-fx-heading text-fx-ink">
                {city.label} · {city.source}
              </h3>
              <dl className="mt-3 grid gap-3">
                {city.about.map((entry) => (
                  <div key={entry.title}>
                    <dt className="text-fx-small font-bold text-fx-ink">{entry.title}</dt>
                    <dd className="text-fx-small text-fx-ink2">{entry.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
        <div className="rounded-fx-lg border border-fx-line bg-fx-paper p-5">
          <h3 className="font-fx-display text-fx-heading text-fx-ink">{ABOUT_VISUALISATION.title}</h3>
          <p className="mt-3 text-fx-small text-fx-ink2">{ABOUT_VISUALISATION.body}</p>
        </div>
      </div>
      <div className="rounded-fx-lg bg-fx-emphasis-soft p-5">
        <h3 className="font-fx-display text-fx-heading text-fx-ink">Keep in mind</h3>
        <ul className="mt-4 grid gap-3">
          {LIMITS.map(([lead, text]) => (
            <li key={lead} className="text-fx-small text-fx-ink2">
              <strong className="text-fx-ink">{lead}</strong>, {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
