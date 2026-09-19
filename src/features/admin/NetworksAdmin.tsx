import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SearchInput } from "@/components/ui/SearchInput";
import { adminNetworksQueryOptions } from "./api";
import { AdminTable, Column, SortableColumn, TD } from "./AdminTable";
import { Pagination } from "./Pagination";
import { adminNetworkParams, type AdminSearch } from "./search";

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

interface Props {
  search: AdminSearch;
  onChange: (patch: Partial<AdminSearch>) => void;
}

export function NetworksAdmin({ search, onChange }: Props) {
  const query = useQuery(adminNetworksQueryOptions(adminNetworkParams(search)));
  const rows = query.data?.data ?? [];
  const meta = query.data?.meta;

  const typing = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(typing.current), []);

  const refine = (patch: Partial<AdminSearch>) => onChange({ ...patch, page: undefined });
  const sort = (sort_by: string, sort_direction: "asc" | "desc") => refine({ sort_by, sort_direction });

  return (
    <div className="space-y-5">
      <div className="rounded-fx-lg border border-fx-line bg-fx-paper p-4">
        <Eyebrow className="mb-2">Search</Eyebrow>
        <SearchInput
          defaultValue={search.q ?? ""}
          placeholder="Network name…"
          aria-label="Search networks"
          onChange={(event) => {
            const value = event.currentTarget.value.trim();
            clearTimeout(typing.current);
            typing.current = setTimeout(() => refine({ q: value || undefined }), 350);
          }}
        />
      </div>

      {query.isError ? (
        <Banner tone="danger">The networks could not be loaded. Try again in a moment.</Banner>
      ) : rows.length === 0 && !query.isPending ? (
        <EmptyState title="No network matches" description="Widen the search, or clear it." />
      ) : (
        <>
          <AdminTable
            busy={query.isFetching}
            head={
              <>
                <SortableColumn label="Network" field="name" current={search.sort_by} direction={search.sort_direction} onSort={sort} />
                <Column label="Runs it" />
                <Column label="Territory" />
                <SortableColumn label="Organisations" field="organizations_count" current={search.sort_by} direction={search.sort_direction} onSort={sort} align="right" />
                <Column label="Created by" />
                <SortableColumn label="Created" field="created_at" current={search.sort_by} direction={search.sort_direction} onSort={sort} align="right" />
              </>
            }
          >
            {rows.map((network) => (
              <tr key={network.id} className="border-t border-fx-line">
                <td className={TD}>
                  <span className="font-bold text-fx-ink">{network.name}</span>
                  {network.description && (
                    <span className="mt-0.5 line-clamp-1 max-w-sm text-fx-label text-fx-muted">{network.description}</span>
                  )}
                </td>
                <td className={TD}>
                  {network.organization ? (
                    <Link to="/organizations/$id" params={{ id: network.organization.slug }} preload="intent" className="hover:text-fx-emphasis">
                      {network.organization.name}
                    </Link>
                  ) : (
                    <span className="text-fx-muted">—</span>
                  )}
                </td>
                <td className={TD}>
                  {network.center_address ? (
                    <span className="line-clamp-1 max-w-xs">
                      {network.center_address}
                      {network.radius_km != null && <span className="text-fx-muted"> · {network.radius_km} km</span>}
                    </span>
                  ) : (
                    <span className="text-fx-muted">Not set</span>
                  )}
                </td>
                <td className={`${TD} text-right tabular-nums`}>{network.organizations_count ?? 0}</td>
                <td className={TD}>{network.created_by?.name ?? <span className="text-fx-muted">—</span>}</td>
                <td className={`${TD} text-right whitespace-nowrap text-fx-muted`}>{shortDate(network.created_at)}</td>
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
