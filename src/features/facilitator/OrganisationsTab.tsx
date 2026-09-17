import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useDebounced } from "@/lib/useDebounced";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { networkOrganizationsMapQueryOptions, networkOrganizationsQueryOptions } from "./api";
import { NetworkMap } from "./NetworkMap";
import { OrganisationFilters, ViewToggle } from "./OrganisationFilters";
import { OrganisationsTable } from "./OrganisationsTable";
import { hasOrgFilters, type NetworkSearch } from "./search";
import { HEALTH_LABELS, HEALTH_TONES, type Network, type NetworkOrganization } from "./types";

interface OrganisationsTabProps {
  network: Network;
  search: NetworkSearch;
  onChange: (patch: Partial<NetworkSearch>) => void;
}

function Cards({ networkSlug, records }: { networkSlug: string; records: NetworkOrganization[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {records.map((record) => (
        <li key={record.id}>
          <Card className="flex h-full items-start gap-3 p-4">
            <Avatar name={record.organization.name} src={record.organization.image_url} size="sm" />
            <div className="min-w-0 flex-1">
              <Link
                to="/facilitator/$networkSlug/organizations/$recordId"
                params={{ networkSlug, recordId: record.id }}
                preload="intent"
                className="block truncate text-fx-body font-bold text-fx-ink hover:text-fx-emphasis"
              >
                {record.organization.name}
              </Link>
              <p className="mt-0.5 truncate text-fx-small text-fx-muted">{record.organization.address ?? "No address"}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone={HEALTH_TONES[record.economic_health] ?? "slate"}>
                  {HEALTH_LABELS[record.economic_health] ?? record.economic_health}
                </Badge>
                {record.specialization && <Badge tone="slate">{record.specialization}</Badge>}
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function OrganisationsTab({ network, search, onChange }: OrganisationsTabProps) {
  const view = search.org_view ?? "table";

  // The URL holds the term; the request waits until typing settles.
  const term = useDebounced(search.q ?? "", 350);
  const settled: NetworkSearch = { ...search, q: term || undefined };

  const list = useInfiniteQuery({ ...networkOrganizationsQueryOptions(network.slug, settled), enabled: view !== "map" });
  const map = useQuery({ ...networkOrganizationsMapQueryOptions(network.slug, settled), enabled: view === "map" });

  const records = view === "map" ? (map.data ?? []) : (list.data?.pages.flatMap((page) => page.data) ?? []);
  const total = view === "map" ? map.data?.length : list.data?.pages[0]?.meta.total_count;
  const pending = view === "map" ? map.isPending : list.isPending;
  const failed = view === "map" ? map.isError : list.isError;

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-fx-small text-fx-muted">
          {total == null ? "…" : `${total} organisation${total === 1 ? "" : "s"}`}
          {hasOrgFilters(search) && " matching your filters"}
        </p>
        <ViewToggle view={view} onChange={(next) => onChange({ org_view: next === "table" ? undefined : next })} />
      </div>

      <OrganisationFilters search={search} onChange={onChange} />

      {failed ? (
        <Banner tone="danger">These organisations could not be loaded.</Banner>
      ) : pending ? (
        <p className="text-fx-small text-fx-muted">Loading…</p>
      ) : records.length === 0 ? (
        <EmptyState
          title={hasOrgFilters(search) ? "No match" : "No organisation followed yet"}
          description={
            hasOrgFilters(search)
              ? "No organisation in this network matches these filters."
              : "Add the organisations this network follows to keep their data, your notes and your interactions in one place."
          }
        />
      ) : view === "map" ? (
        <div className="h-[32rem] overflow-hidden rounded-fx-lg border border-fx-line">
          <NetworkMap network={network} records={records} />
        </div>
      ) : (
        <>
          {view === "table" ? (
            <OrganisationsTable networkSlug={network.slug} records={records} />
          ) : (
            <Cards networkSlug={network.slug} records={records} />
          )}
          <InfiniteScrollSentinel
            hasNextPage={list.hasNextPage}
            isFetchingNextPage={list.isFetchingNextPage}
            fetchNextPage={() => list.fetchNextPage()}
          />
        </>
      )}
    </div>
  );
}
