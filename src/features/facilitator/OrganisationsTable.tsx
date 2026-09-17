import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { orgKindLabel } from "@/features/organizations/kinds";
import { HEALTH_LABELS, HEALTH_TONES, type NetworkOrganization } from "./types";
import { asNeeds, NEED_OPTIONS } from "./record/needs";

const TH = "whitespace-nowrap px-3 py-2.5 text-left font-fx-display text-fx-label text-fx-muted uppercase";
const TD = "px-3 py-3 align-middle";

const needsCount = (record: NetworkOrganization): number => {
  const needs = asNeeds(record.needs);
  return NEED_OPTIONS.filter((option) => needs[option.key]?.selected).length;
};

const health = (value: string) => (
  <Badge tone={HEALTH_TONES[value] ?? "slate"}>{HEALTH_LABELS[value] ?? value}</Badge>
);

/**
 * The working list: everything this network knows about its organisations, dense
 * enough to scan. The API exposes no sort scope, so the order is the API's own
 * (most recently added first) — sorting the loaded page only would lie about the rest.
 */
export function OrganisationsTable({ networkSlug, records }: { networkSlug: string; records: NetworkOrganization[] }) {
  return (
    <div className="overflow-x-auto rounded-fx-lg border border-fx-line bg-fx-paper">
      <table className="w-full min-w-3xl border-collapse text-fx-small">
        <thead>
          <tr className="border-b border-fx-line bg-fx-panel">
            <th scope="col" className={TH}>Organisation</th>
            <th scope="col" className={TH}>Where</th>
            <th scope="col" className={TH}>Economic</th>
            <th scope="col" className={TH}>Environmental</th>
            <th scope="col" className={`${TH} text-right`}>Employees</th>
            <th scope="col" className={TH}>Specialisation</th>
            <th scope="col" className={`${TH} text-right`}>Needs</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const org = record.organization;
            const needs = needsCount(record);

            return (
              <tr key={record.id} className="border-b border-fx-line last:border-b-0 hover:bg-fx-panel">
                <td className={TD}>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={org.name} src={org.image_url} size="sm" />
                    <div className="min-w-0">
                      <Link
                        to="/facilitator/$networkSlug/organizations/$recordId"
                        params={{ networkSlug, recordId: record.id }}
                        preload="intent"
                        className="block truncate font-bold text-fx-ink hover:text-fx-emphasis"
                      >
                        {org.name}
                      </Link>
                      <span className="block truncate text-fx-label text-fx-muted">{orgKindLabel(org.kind)}</span>
                    </div>
                  </div>
                </td>
                <td className={`${TD} text-fx-ink2`}>
                  <span className="block max-w-56 truncate">{org.address ?? "—"}</span>
                  {org.country_code && <span className="block text-fx-label text-fx-muted">{org.country_code}</span>}
                </td>
                <td className={TD}>{health(record.economic_health)}</td>
                <td className={TD}>{health(record.environmental_score)}</td>
                <td className={`${TD} text-right tabular-nums text-fx-ink2`}>
                  {record.number_of_employees ?? "—"}
                </td>
                <td className={`${TD} text-fx-ink2`}>
                  <span className="block max-w-48 truncate">{record.specialization ?? "—"}</span>
                </td>
                <td className={`${TD} text-right tabular-nums`}>
                  {needs > 0 ? <Badge tone="violet">{needs}</Badge> : <span className="text-fx-muted">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
