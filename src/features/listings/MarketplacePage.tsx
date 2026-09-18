import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { geoParams, myOrgLocation, resolveLocation } from "@/features/explore/location";
import { listingsInfiniteQueryOptions, listingsMapQueryOptions } from "./api";
import { DirectionFilter } from "./filters/DirectionFilter";
import { LocationFilter } from "./filters/LocationFilter";
import { SearchBox } from "./filters/SearchBox";
import { TaxonomyFilter } from "./filters/TaxonomyFilter";
import { ViewToggle } from "./filters/ViewToggle";
import { ListingCard, ListingGridSkeleton, ListingRow } from "./ListingCard";
import { ListingsMap } from "./map/ListingsMap";
import { PostListingAction } from "./PostListingAction";

export function MarketplacePage() {
  const search = useSearch({ from: "/_open/marketplace/" });
  const me = useOptionalMe();
  const mine = myOrgLocation(me);
  const location = resolveLocation(search, mine);
  const view = search.view ?? "cards";
  const onMap = view === "map";

  const filters = {
    search: search.search,
    by_direction: search.direction,
    one_off: search.one_off,
    by_type: search.by_type,
    by_category: search.by_category,
    by_subcategory: search.by_subcategory,
    ...geoParams(location, search.country),
  };

  // Page by page while scrolling a list; all of them at once on the map.
  const listQuery = useInfiniteQuery({ ...listingsInfiniteQueryOptions(filters), enabled: !onMap });
  const mapQuery = useQuery({ ...listingsMapQueryOptions(filters), enabled: onMap });

  const listings = onMap ? (mapQuery.data?.data ?? []) : (listQuery.data?.pages.flatMap((page) => page.data) ?? []);
  const total = onMap ? mapQuery.data?.meta.total_count : listQuery.data?.pages[0]?.meta.total_count;
  const pending = onMap ? mapQuery.isPending : listQuery.isPending;
  const failed = onMap ? mapQuery.isError : listQuery.isError;
  const fetching = onMap ? mapQuery.isFetching : listQuery.isFetching;
  const filtered = !!(
    search.search ||
    search.direction ||
    search.one_off !== undefined ||
    search.by_type ||
    search.country ||
    location.active
  );

  return (
    <>
      <PageHeader
        title="Marketplace"
        lede="Materials, capacities, services and products — offered and wanted across the circular textile network."
        actions={<PostListingAction me={me} />}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside aria-label="Filters" className="space-y-7">
          <SearchBox key={search.search ?? ""} value={search.search} />
          <DirectionFilter search={search} />
          <TaxonomyFilter search={search} />
          <LocationFilter search={search} location={location} hasMyLocation={mine !== null} />
        </aside>

        <section aria-label="Listings" aria-busy={fetching}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-fx-small font-bold text-fx-ink2">
              {total === undefined ? "Loading…" : `${total} listing${total === 1 ? "" : "s"}`}
              {location.active && <span className="font-normal text-fx-muted"> within {location.radius} km of {location.label}</span>}
            </p>
            <ViewToggle view={view} />
          </div>

          {pending ? (
            onMap ? (
              <div className="h-[70vh] min-h-[420px] animate-pulse rounded-fx-lg bg-fx-panel" />
            ) : (
              <ListingGridSkeleton />
            )
          ) : failed ? (
            <Banner tone="danger">The listings could not be loaded. Try again in a moment.</Banner>
          ) : listings.length === 0 ? (
            <EmptyState
              title={filtered ? "No listing matches" : "No listings yet"}
              description={
                filtered
                  ? "Widen the radius, remove a filter — or be the one who posts it."
                  : "Be the first to say what you offer or look for."
              }
              action={<PostListingAction me={me} />}
            />
          ) : onMap ? (
            <ListingsMap listings={listings} location={location} />
          ) : view === "cards" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {listings.map((listing) => (
                <ListingRow key={listing.id} listing={listing} />
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
