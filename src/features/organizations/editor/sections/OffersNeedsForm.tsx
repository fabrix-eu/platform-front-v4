import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Globe, Lock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Button, ButtonLink } from "@/components/ui/Button";
import { listingsInfiniteQueryOptions } from "@/features/listings/api";
import { categoryLabel, typeMeta } from "@/features/listings/taxonomy";
import type { Listing } from "@/features/listings/types";
import type { OrganizationProfile } from "../../types";
import { FormGroup } from "./FormGroup";

function OfferRow({ listing }: { listing: Listing }) {
  const meta = typeMeta(listing.listing_type);
  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
      <div className="min-w-0 flex-1">
        <Link to="/marketplace/$id" params={{ id: listing.id }} className="font-bold text-fx-ink hover:text-fx-emphasis">
          {listing.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-fx-small text-fx-muted">
          <Badge tone={meta.tone}>{meta.singular}</Badge>
          {categoryLabel(listing.category)}
        </div>
      </div>
      <Badge tone="teal">
        <Globe aria-hidden className="size-3" />
        On the Marketplace
      </Badge>
      <ButtonLink to="/marketplace/$id/edit" params={{ id: listing.id }} variant="secondary" size="sm">
        Edit
      </ButtonLink>
    </li>
  );
}

// D · Offers & needs — offers are the organisation's Marketplace listings (the API only
// returns the active, unexpired ones). The prototype's private offers, visibility levels,
// alerts and needs have no model on the API yet.
export function OffersNeedsForm({ org }: { org: OrganizationProfile }) {
  const query = useInfiniteQuery(listingsInfiniteQueryOptions({ by_organization: org.id }));
  const listings = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-7">
      <FormGroup
        title="List your offers"
        description="What could you offer other organisations? Everything you can make or do, share, advise on, or sell. Tag each one so the right people find it."
        aside={<Badge tone="slate">Only what you publish</Badge>}
      >
        {query.isPending ? (
          <p className="text-fx-small text-fx-muted">Loading your listings…</p>
        ) : query.isError ? (
          <Banner tone="danger">Your listings could not be loaded. Try again in a moment.</Banner>
        ) : listings.length === 0 ? (
          <p className="text-fx-body text-fx-ink2">No offers yet. Each one goes on the Marketplace as a listing — it takes two minutes.</p>
        ) : (
          <ul className="divide-y divide-fx-line border-y border-fx-line">
            {listings.map((listing) => (
              <OfferRow key={listing.id} listing={listing} />
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/marketplace/new" size="sm">
            <Plus aria-hidden className="size-4" strokeWidth={2.6} />
            Add an offer
          </ButtonLink>
          {query.hasNextPage && (
            <Button variant="ghost" size="sm" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
              {query.isFetchingNextPage ? "Loading…" : "Show more"}
            </Button>
          )}
        </div>
      </FormGroup>

      <FormGroup
        title="List your needs"
        description="Being short of something is not a weakness, and you do not have to announce it. Keep a need to yourself and set an alert — or make it public and let people come to you."
        aside={
          <Badge tone="slate">
            <Lock aria-hidden className="size-3" />
            Only me, unless you publish
          </Badge>
        }
      >
        <Banner tone="info">Listing your needs is not available yet — it is coming to this section soon.</Banner>
      </FormGroup>
    </div>
  );
}
