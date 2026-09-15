import { useInfiniteQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { listingsInfiniteQueryOptions } from "@/features/listings/api";
import { ListingCard } from "@/features/listings/ListingCard";
import type { OrganizationProfile } from "../types";
import { ProfileSection } from "./ProfileSections";

// What it offers and looks for — the reason most visitors open a profile.
export function OrgListingsSection({ org, isMember }: { org: OrganizationProfile; isMember: boolean }) {
  const query = useInfiniteQuery(listingsInfiniteQueryOptions({ by_organization: org.id }));
  const listings = query.data?.pages[0]?.data ?? [];
  const total = query.data?.pages[0]?.meta.total_count ?? 0;

  if (query.isPending || query.isError) return null;

  if (listings.length === 0) {
    if (!isMember) return null;
    return (
      <EmptyState
        title="No listings yet"
        description="A listing is how organisations nearby find what you offer or need. It takes two minutes."
        action={
          <ButtonLink to="/marketplace/new">
            <Plus className="size-4" strokeWidth={2.6} />
            Add a listing
          </ButtonLink>
        }
      />
    );
  }

  return (
    <ProfileSection title="Listings" count={total}>
      <div className="grid gap-5 sm:grid-cols-2">
        {listings.slice(0, 4).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
      {isMember && total > 4 && (
        <div className="mt-5">
          <ButtonLink to="/marketplace" variant="ghost" size="sm">
            Browse the marketplace
          </ButtonLink>
        </div>
      )}
    </ProfileSection>
  );
}
