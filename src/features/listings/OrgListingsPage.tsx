import { useInfiniteQuery } from "@tanstack/react-query";
import { useCurrentOrg } from "@/lib/activeOrg";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { listingsInfiniteQueryOptions } from "./api";
import { ListingCard, ListingGridSkeleton } from "./ListingCard";
import { PostListingAction } from "./PostListingAction";

// The organisation's own listings — the entry the old front never linked to.
export function OrgListingsPage() {
  const { me, currentOrg } = useCurrentOrg();
  const orgId = currentOrg?.organization_id;
  const query = useInfiniteQuery({ ...listingsInfiniteQueryOptions({ by_organization: orgId }), enabled: !!orgId });
  const listings = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <PageHeader
        eyebrow={currentOrg?.organization_name}
        title="Listings"
        lede="What your organisation offers and looks for. Active listings appear in the marketplace."
        actions={<PostListingAction me={me} />}
      />
      <div className="mt-10">
        {query.isPending ? (
          <ListingGridSkeleton />
        ) : query.isError ? (
          <Banner tone="danger">Your listings could not be loaded. Try again in a moment.</Banner>
        ) : listings.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="A listing is how organisations nearby find what you offer or need. It takes two minutes."
            action={<PostListingAction me={me} />}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
        <InfiniteScrollSentinel
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </div>
    </>
  );
}
