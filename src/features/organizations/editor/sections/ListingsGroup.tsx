import type { ReactNode } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Globe, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import type { MeOrganization } from "@/lib/auth";
import { listingsInfiniteQueryOptions } from "@/features/listings/api";
import { DeleteListingButton } from "@/features/listings/DeleteListingButton";
import type { Direction } from "@/features/listings/directions";
import { EditListingDialog } from "@/features/listings/form/EditListingDialog";
import { NewListingDialog } from "@/features/listings/form/NewListingDialog";
import { categoryLabel, typeMeta } from "@/features/listings/taxonomy";
import type { Listing } from "@/features/listings/types";
import { FormGroup } from "./FormGroup";

function ListingRow({ listing, organizations }: { listing: Listing; organizations: MeOrganization[] }) {
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
      <div className="flex items-center gap-2">
        {/* Edit keeps the offered/wanted question: this is where an author who
            picked the wrong side puts it right. */}
        <EditListingDialog
          listingId={listing.id}
          organizations={organizations}
          trigger={
            <Button variant="secondary" size="sm">
              Edit
            </Button>
          }
        />
        <DeleteListingButton listingId={listing.id} title={listing.title} />
      </div>
    </li>
  );
}

interface ListingsGroupProps {
  organizationId: string;
  organizations: MeOrganization[];
  /** One side of the exchange. It filters the list and it is what the Add button posts. */
  direction: Direction;
  title: string;
  description: string;
  empty: string;
  addLabel: string;
  aside?: ReactNode;
}

/**
 * One side of section D — the organisation's own listings running that way, and the
 * button that adds another. Rendered twice, once per direction, which is what lets the
 * form stop asking: the answer is the group you are standing in.
 */
export function ListingsGroup({
  organizationId,
  organizations,
  direction,
  title,
  description,
  empty,
  addLabel,
  aside,
}: ListingsGroupProps) {
  const query = useInfiniteQuery(
    listingsInfiniteQueryOptions({ by_organization: organizationId, by_direction: direction }),
  );
  const listings = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FormGroup title={title} description={description} aside={aside}>
      {query.isPending ? (
        <p className="text-fx-small text-fx-muted">Loading your listings…</p>
      ) : query.isError ? (
        <Banner tone="danger">Your listings could not be loaded. Try again in a moment.</Banner>
      ) : listings.length === 0 ? (
        <p className="text-fx-body text-fx-ink2">{empty}</p>
      ) : (
        <ul className="divide-y divide-fx-line border-y border-fx-line">
          {listings.map((listing) => (
            <ListingRow key={listing.id} listing={listing} organizations={organizations} />
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-3">
        <NewListingDialog
          organizationId={organizationId}
          organizations={organizations}
          direction={direction}
          trigger={
            <Button size="sm">
              <Plus aria-hidden className="size-4" strokeWidth={2.6} />
              {addLabel}
            </Button>
          }
        />
        {query.hasNextPage && (
          <Button variant="ghost" size="sm" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
            {query.isFetchingNextPage ? "Loading…" : "Show more"}
          </Button>
        )}
      </div>
    </FormGroup>
  );
}
