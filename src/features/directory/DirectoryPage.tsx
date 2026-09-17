import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { csvList } from "@/lib/csv";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { Banner } from "@/components/ui/Banner";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { geoParams, myOrgLocation, resolveLocation } from "@/features/explore/location";
import { categoriesForTypes } from "@/features/listings/taxonomy";
import { directoryInfiniteQueryOptions, directoryMapQueryOptions } from "./api";
import { ActivityFilter, DirectoryPlaceFilter, DirectorySearchBox, DirectoryViewToggle, KindFilter, StatusFilter } from "./DirectoryFilters";
import { DirectoryMap } from "./DirectoryMap";
import { OrganizationCard, OrganizationGridSkeleton, OrganizationRow } from "./OrganizationCard";

export function DirectoryPage() {
  const search = useSearch({ from: "/_auth/global" });
  const me = useOptionalMe();
  const mine = myOrgLocation(me);
  const location = resolveLocation(search, mine);
  const view = search.view ?? "cards";
  const onMap = view === "map";

  // An activity is a heading, never a stored value: organisations keep categories in
  // `specialties`, so each picked activity travels as the categories underneath it.
  const activities = csvList(search.activities);

  const filters = {
    search: search.search,
    kinds: search.kinds,
    specialties: activities.length > 0 ? categoriesForTypes(activities).join(",") : undefined,
    ...(search.status ? { by_claimed: search.status === "claimed" } : {}),
    ...geoParams(location, search.country),
  };

  // Page by page while scrolling a list; all of them at once on the map.
  const listQuery = useInfiniteQuery({ ...directoryInfiniteQueryOptions(filters), enabled: !onMap });
  const mapQuery = useQuery({ ...directoryMapQueryOptions(filters), enabled: onMap });

  const organizations = listQuery.data?.pages.flatMap((page) => page.organizations) ?? [];
  const mapOrganizations = mapQuery.data?.organizations ?? [];
  const total = onMap ? mapQuery.data?.meta.total_count : listQuery.data?.pages[0]?.meta.total_count;
  const pending = onMap ? mapQuery.isPending : listQuery.isPending;
  const failed = onMap ? mapQuery.isError : listQuery.isError;
  const fetching = onMap ? mapQuery.isFetching : listQuery.isFetching;
  const filtered = !!(search.search || search.kinds || search.activities || search.country || search.status || location.active);

  // The map payload has no `claimed`, so whatever the list already knows is reused.
  const claimedById = new Map(organizations.map((org) => [org.id, org.claimed]));

  return (
    <>
      <PageHeader
        title="Directory"
        lede="Every organisation of the circular textile ecosystem — the ones on FABRIX, and the ones still waiting for their team."
        actions={
          <ButtonLink to="/organizations/new">
            <Plus className="size-4" strokeWidth={2.6} />
            Add an organisation
          </ButtonLink>
        }
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside aria-label="Filters" className="space-y-7">
          <DirectorySearchBox key={search.search ?? ""} value={search.search} />
          <KindFilter kinds={search.kinds} />
          <ActivityFilter activities={search.activities} />
          <DirectoryPlaceFilter search={search} location={location} hasMyLocation={mine !== null} />
          <StatusFilter status={search.status} />
        </aside>

        <section aria-label="Organisations" aria-busy={fetching}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-fx-small font-bold text-fx-ink2">
              {total === undefined ? "Loading…" : `${total} organisation${total === 1 ? "" : "s"}`}
              {location.active && (
                <span className="font-normal text-fx-muted">
                  {" "}
                  within {location.radius} km of {location.label}
                </span>
              )}
            </p>
            <DirectoryViewToggle view={view} />
          </div>

          {pending ? (
            onMap ? (
              <div className="h-[70vh] min-h-[420px] animate-pulse rounded-fx-lg bg-fx-panel" />
            ) : (
              <OrganizationGridSkeleton />
            )
          ) : failed ? (
            <Banner tone="danger">The directory could not be loaded. Try again in a moment.</Banner>
          ) : onMap ? (
            <DirectoryMap organizations={mapOrganizations} location={location} claimedById={claimedById} />
          ) : organizations.length === 0 ? (
            <EmptyState
              title={filtered ? "No organisation matches" : "Nobody here yet"}
              description={
                filtered
                  ? "Widen the radius, drop a filter — or add the organisation you are looking for."
                  : "Add the organisations you work with: they appear here, and can claim their profile."
              }
              action={
                <ButtonLink to="/organizations/new">
                  <Plus className="size-4" strokeWidth={2.6} />
                  Add an organisation
                </ButtonLink>
              }
            />
          ) : view === "cards" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {organizations.map((org) => (
                <OrganizationCard key={org.id} org={org} />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {organizations.map((org) => (
                <OrganizationRow key={org.id} org={org} />
              ))}
            </div>
          )}

          {!onMap && (
            <InfiniteScrollSentinel
              hasNextPage={listQuery.hasNextPage}
              isFetchingNextPage={listQuery.isFetchingNextPage}
              fetchNextPage={listQuery.fetchNextPage}
            />
          )}
        </section>
      </div>
    </>
  );
}
