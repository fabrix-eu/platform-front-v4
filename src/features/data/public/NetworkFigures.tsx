import { orgKindLabel } from "@/features/organizations/kinds";
import { relationLabel } from "@/features/organizations/relations";
import { typeMeta } from "@/features/listings/taxonomy";
import { type Count, type DataSummary, formatCount } from "./api";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
const countryLabel = (code: string) => {
  try {
    return countryNames.of(code) ?? code;
  } catch {
    return code;
  }
};

interface BarListProps {
  title: string;
  rows: Count[];
  total: number;
  label: (key: string) => string;
  limit?: number;
}

/** Horizontal bars drawn to the group's largest value, the count next to each. */
function BarList({ title, rows, total, label, limit = 6 }: BarListProps) {
  const shown = rows.slice(0, limit);
  const max = shown[0]?.count ?? 1;
  return (
    <div className="rounded-fx-lg border border-fx-line bg-fx-paper p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-fx-display text-fx-heading text-fx-ink">{title}</h3>
        <span className="text-fx-small text-fx-muted tabular-nums">{formatCount(total)} in all</span>
      </div>
      <ol className="mt-4 grid gap-2.5">
        {shown.map((row) => (
          <li key={row.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-fx-small">
            <span className="truncate text-fx-ink2">{label(row.key)}</span>
            <span className="font-bold text-fx-ink tabular-nums">{formatCount(row.count)}</span>
            <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-fx-slate-soft">
              <span className="block h-full rounded-full bg-fx-emphasis" style={{ width: `${Math.max(2, (row.count / max) * 100)}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** What FABRIX adds to the registers, in aggregates: no organisation is named. */
export function NetworkFigures({ network }: { network: DataSummary["network"] }) {
  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <BarList title="Organisations by country" rows={network.organizations_by_country} total={network.organizations} label={countryLabel} />
        <BarList title="Organisations by kind" rows={network.organizations_by_kind} total={network.organizations} label={orgKindLabel} />
        <BarList title="Relations by type" rows={network.relations_by_type} total={network.relations} label={relationLabel} />
        <BarList title="Listings by type" rows={network.listings_by_type} total={network.listings} label={(key) => typeMeta(key).label} />
      </div>
      <p className="mt-4 text-fx-small text-fx-muted">
        Also on the platform: {formatCount(network.events)} events, {formatCount(network.assessments_completed)} completed Impact Compass
        questionnaires, and {formatCount(network.networks)} facilitator networks following {formatCount(network.network_organizations)}{" "}
        organisations.
      </p>
    </>
  );
}
