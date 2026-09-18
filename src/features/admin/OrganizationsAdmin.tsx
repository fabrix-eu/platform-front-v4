import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { csvList, toggleCsv } from "@/lib/csv";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { MultiSelectMenu } from "@/components/ui/MultiSelectMenu";
import { Pill } from "@/components/ui/Pill";
import { SearchInput } from "@/components/ui/SearchInput";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EU_COUNTRIES } from "@/features/explore/countries";
import { ORG_KIND_LABELS, orgKindLabel } from "@/features/organizations/kinds";
import { adminOrganizationsQueryOptions } from "./api";
import { AdminTable, Column, SortableColumn, TD } from "./AdminTable";
import { Pagination } from "./Pagination";
import { adminListParams, type AdminSearch } from "./search";

const KIND_OPTIONS = Object.entries(ORG_KIND_LABELS).map(([value, label]) => ({ value, label }));

const COUNTRY = new Map(EU_COUNTRIES.map((c) => [c.code, c.name]));

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

interface Props {
  search: AdminSearch;
  onChange: (patch: Partial<AdminSearch>) => void;
}

export function OrganizationsAdmin({ search, onChange }: Props) {
  const query = useQuery(adminOrganizationsQueryOptions(adminListParams(search)));
  const rows = query.data?.data ?? [];
  const meta = query.data?.meta;

  // Typing is not a query. Without this, every keystroke would rewrite the URL and ask
  // the API again — six requests to spell "Maasstad".
  const typing = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(typing.current), []);

  // Any change to what is being asked for sends you back to the first page: page 4 of
  // the old filter has nothing to do with page 4 of the new one.
  const refine = (patch: Partial<AdminSearch>) => onChange({ ...patch, page: undefined });
  const sort = (sort_by: string, sort_direction: "asc" | "desc") => refine({ sort_by, sort_direction });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-fx-lg border border-fx-line bg-fx-paper p-4 lg:grid-cols-[minmax(0,1fr)_16rem_auto]">
        <div>
          <Eyebrow className="mb-2">Search</Eyebrow>
          <SearchInput
            defaultValue={search.q ?? ""}
            placeholder="Name, description…"
            aria-label="Search organisations"
            onChange={(event) => {
              const value = event.currentTarget.value.trim();
              clearTimeout(typing.current);
              typing.current = setTimeout(() => refine({ q: value || undefined }), 350);
            }}
          />
        </div>

        <div>
          <Eyebrow className="mb-2">Kind</Eyebrow>
          <MultiSelectMenu
            label="Kind"
            options={KIND_OPTIONS}
            selected={csvList(search.kinds)}
            onToggle={(value) => refine({ kinds: toggleCsv(search.kinds, value) })}
            onClear={() => refine({ kinds: undefined })}
          />
        </div>

        <div>
          <Eyebrow className="mb-2">Status</Eyebrow>
          <div className="flex flex-wrap gap-2">
            <Pill selected={!search.status} onClick={() => refine({ status: undefined })}>All</Pill>
            <Pill selected={search.status === "claimed"} onClick={() => refine({ status: "claimed" })}>Claimed</Pill>
            <Pill selected={search.status === "unclaimed"} onClick={() => refine({ status: "unclaimed" })}>Unclaimed</Pill>
          </div>
        </div>
      </div>

      {query.isError ? (
        <Banner tone="danger">The organisations could not be loaded. Try again in a moment.</Banner>
      ) : rows.length === 0 && !query.isPending ? (
        <EmptyState title="Nothing matches" description="Widen the search, or drop a filter." />
      ) : (
        <>
          <AdminTable
            busy={query.isFetching}
            head={
              <>
                <SortableColumn label="Organisation" field="name" current={search.sort_by} direction={search.sort_direction} onSort={sort} />
                <SortableColumn label="Kind" field="kind" current={search.sort_by} direction={search.sort_direction} onSort={sort} />
                <SortableColumn label="Country" field="country_code" current={search.sort_by} direction={search.sort_direction} onSort={sort} />
                <SortableColumn label="Claimed" field="claimed_at" current={search.sort_by} direction={search.sort_direction} onSort={sort} />
                <Column label="Links" align="right" />
                <SortableColumn label="Added" field="created_at" current={search.sort_by} direction={search.sort_direction} onSort={sort} align="right" />
              </>
            }
          >
            {rows.map((org) => (
              <tr key={org.id} className="border-t border-fx-line">
                <td className={TD}>
                  <Link to="/organizations/$id" params={{ id: org.slug }} preload="intent" className="flex items-center gap-2.5 hover:text-fx-emphasis">
                    <Avatar name={org.name} src={org.image_url} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-fx-ink">{org.name}</span>
                      {org.address && <span className="block truncate text-fx-label text-fx-muted">{org.address}</span>}
                    </span>
                  </Link>
                </td>
                <td className={TD}>{orgKindLabel(org.kind)}</td>
                <td className={TD}>{org.country_code ? (COUNTRY.get(org.country_code) ?? org.country_code) : "—"}</td>
                <td className={TD}>
                  {org.claimed ? <Badge tone="green">Claimed</Badge> : <Badge tone="slate">Unclaimed</Badge>}
                </td>
                <td className={`${TD} text-right tabular-nums`}>{org.relations_count}</td>
                <td className={`${TD} text-right whitespace-nowrap text-fx-muted`}>{shortDate(org.created_at)}</td>
              </tr>
            ))}
          </AdminTable>

          {meta && (
            <Pagination
              page={meta.current_page}
              totalPages={meta.total_pages}
              totalCount={meta.total_count}
              onChange={(page) => onChange({ page })}
            />
          )}
        </>
      )}
    </div>
  );
}
