import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { geoParams, myOrgLocation, resolveLocation } from "@/features/explore/location";
import { listingsInfiniteQueryOptions } from "./api";
import { LocationFilter } from "./filters/LocationFilter";
import { SearchBox } from "./filters/SearchBox";
import { TaxonomyFilter } from "./filters/TaxonomyFilter";
import { ViewToggle } from "./filters/ViewToggle";
import { ListingCard, ListingGridSkeleton, ListingRow } from "./ListingCard";
import { PostListingAction } from "./PostListingAction";

export function MarketplacePage() {
  const search = useSearch({ from: "/_open/marketplace/" });
  const me = useOptionalMe();
  const mine = myOrgLocation(me);
  const location = resolveLocation(search, mine);
  const view = search.view ?? "cards";

  const query = useInfiniteQuery(
    listingsInfiniteQueryOptions({
      search: search.search,
      by_type: search.by_type,
      by_category: search.by_category,
      by_subcategory: search.by_subcategory,
      ...geoParams(location, search.country),
    }),
  );

  const listings = query.data?.pages.flatMap((page) => page.data) ?? [];
  const total = query.data?.pages[0]?.meta.total_count;
  const filtered = !!(search.search || search.by_type || search.country || location.active);

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
          <TaxonomyFilter search={search} />
          <LocationFilter search={search} location={location} hasMyLocation={mine !== null} />
        </aside>

        <section aria-label="Listings" aria-busy={query.isFetching}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-fx-small font-bold text-fx-ink2">
              {total === undefined ? "Loading…" : `${total} listing${total === 1 ? "" : "s"}`}
              {location.active && <span className="font-normal text-fx-muted"> within {location.radius} km of {location.label}</span>}
            </p>
            <ViewToggle view={view} />
          </div>

          {query.isPending ? (
            <ListingGridSkeleton />
          ) : query.isError ? (
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

          <InfiniteScrollSentinel
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </section>
      </div>
    </>
  );
}
