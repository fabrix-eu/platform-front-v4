import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useDebounced } from "@/lib/useDebounced";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { networkOrganizationsQueryOptions } from "./api";
import { HEALTH_LABELS, HEALTH_TONES, type Network } from "./types";

interface OrganisationsTabProps {
  network: Network;
  q?: string;
  onSearch: (q: string) => void;
}

export function OrganisationsTab({ network, q, onSearch }: OrganisationsTabProps) {
  // The URL holds the term; the request waits until typing settles.
  const debounced = useDebounced(q ?? "", 350);
  const query = useInfiniteQuery(networkOrganizationsQueryOptions(network.slug, debounced || undefined));

  const records = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mt-8">
      <SearchInput
        defaultValue={q ?? ""}
        placeholder="Search the organisations you follow"
        onChange={(e) => onSearch(e.currentTarget.value)}
        className="max-w-md"
      />

      {query.isError ? (
        <Banner tone="danger" className="mt-6">These organisations could not be loaded.</Banner>
      ) : query.isPending ? (
        <p className="mt-6 text-fx-small text-fx-muted">Loading…</p>
      ) : records.length === 0 ? (
        <EmptyState
          className="mt-6"
          title={q ? "No match" : "No organisation followed yet"}
          description={
            q
              ? "No organisation in this network matches that search."
              : "Add the organisations this network follows to keep their data and your notes in one place."
          }
        />
      ) : (
        <>
          <p className="mt-6 text-fx-small text-fx-muted">
            {query.data.pages[0].meta.total_count} organisation{query.data.pages[0].meta.total_count === 1 ? "" : "s"}
          </p>

          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {records.map((record) => {
              const org = record.organization;
              return (
                <li key={record.id}>
                  <Card className="flex h-full items-start gap-3 p-4">
                    <Avatar name={org.name} src={org.image_url} size="sm" />
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/organizations/$id"
                        params={{ id: org.slug ?? org.id }}
                        preload="intent"
                        className="block truncate text-fx-body font-bold text-fx-ink hover:text-fx-emphasis"
                      >
                        {org.name}
                      </Link>
                      <p className="mt-0.5 truncate text-fx-small text-fx-muted">{org.address ?? "No address"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge tone={HEALTH_TONES[record.economic_health] ?? "slate"}>
                          {HEALTH_LABELS[record.economic_health] ?? record.economic_health}
                        </Badge>
                        {record.specialization && <Badge tone="slate">{record.specialization}</Badge>}
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>

          <InfiniteScrollSentinel
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={() => query.fetchNextPage()}
          />
        </>
      )}
    </div>
  );
}
