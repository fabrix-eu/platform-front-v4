import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { BadgeTone } from "@/components/ui/Badge";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { adminClaimsQueryOptions, type ClaimStatus } from "./api";
import { AdminTable, Column, SortableColumn, TD } from "./AdminTable";
import { ClaimActions } from "./ClaimActions";
import { Pagination } from "./Pagination";
import { adminClaimParams, type AdminSearch } from "./search";

const STATUSES: ClaimStatus[] = ["pending", "approved", "rejected", "cancelled"];

const TONE: Record<ClaimStatus, BadgeTone> = {
  pending: "amber",
  approved: "green",
  rejected: "rose",
  cancelled: "slate",
};

const LABEL: Record<ClaimStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

interface Props {
  search: AdminSearch;
  onChange: (patch: Partial<AdminSearch>) => void;
}

export function ClaimsAdmin({ search, onChange }: Props) {
  const query = useQuery(adminClaimsQueryOptions(adminClaimParams(search)));
  const rows = query.data?.data ?? [];
  const meta = query.data?.meta;

  const refine = (patch: Partial<AdminSearch>) => onChange({ ...patch, page: undefined });
  const sort = (sort_by: string, sort_direction: "asc" | "desc") => refine({ sort_by, sort_direction });

  return (
    <div className="space-y-5">
      <div className="rounded-fx-lg border border-fx-line bg-fx-paper p-4">
        <Eyebrow className="mb-2">Status</Eyebrow>
        <div className="flex flex-wrap gap-2">
          <Pill selected={!search.claim_status} onClick={() => refine({ claim_status: undefined })}>All</Pill>
          {STATUSES.map((status) => (
            <Pill
              key={status}
              tone={TONE[status]}
              selected={search.claim_status === status}
              onClick={() => refine({ claim_status: search.claim_status === status ? undefined : status })}
            >
              {LABEL[status]}
            </Pill>
          ))}
        </div>
      </div>

      {query.isError ? (
        <Banner tone="danger">The claims could not be loaded. Try again in a moment.</Banner>
      ) : rows.length === 0 && !query.isPending ? (
        <EmptyState title="No claim here" description="Nothing is waiting under this filter." />
      ) : (
        <>
          <AdminTable
            busy={query.isFetching}
            head={
              <>
                <SortableColumn label="Status" field="status" current={search.sort_by} direction={search.sort_direction} onSort={sort} />
                <Column label="Organisation" />
                <Column label="Claimant" />
                <Column label="Why they say it is theirs" />
                <SortableColumn label="Asked" field="created_at" current={search.sort_by} direction={search.sort_direction} onSort={sort} align="right" />
                <Column label="Decision" align="right" />
              </>
            }
          >
            {rows.map((claim) => (
              <tr key={claim.id} className="border-t border-fx-line align-top">
                <td className={TD}>
                  <Badge tone={TONE[claim.status] ?? "slate"}>{LABEL[claim.status] ?? claim.status}</Badge>
                </td>
                <td className={TD}>
                  {claim.organization ? (
                    <Link to="/organizations/$id" params={{ id: claim.organization.slug }} preload="intent" className="font-bold text-fx-ink hover:text-fx-emphasis">
                      {claim.organization.name}
                    </Link>
                  ) : (
                    <span className="text-fx-muted">gone</span>
                  )}
                </td>
                <td className={TD}>
                  <span className="block font-bold text-fx-ink">{claim.claimant?.name ?? "—"}</span>
                  {claim.claimant?.email && <span className="block text-fx-label text-fx-muted">{claim.claimant.email}</span>}
                </td>
                <td className={TD}>
                  <p className="max-w-md whitespace-pre-line text-fx-ink2">{claim.justification}</p>
                  {claim.rejection_reason && (
                    <p className="mt-1 max-w-md text-fx-label text-fx-rose">Refused: {claim.rejection_reason}</p>
                  )}
                </td>
                <td className={`${TD} text-right whitespace-nowrap text-fx-muted`}>{shortDate(claim.created_at)}</td>
                <td className={`${TD} text-right`}>
                  <ClaimActions claim={claim} />
                </td>
              </tr>
            ))}
          </AdminTable>

          {meta && (
            <Pagination page={meta.current_page} totalPages={meta.total_pages} totalCount={meta.total_count} onChange={(page) => onChange({ page })} />
          )}
        </>
      )}
    </div>
  );
}
