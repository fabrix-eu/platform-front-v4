import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { listingQueryOptions } from "../api";
import { directionMeta, ONE_OFF } from "../directions";
import { categoryLabel, subcategoryLabel, typeMeta } from "../taxonomy";
import { ListingAside } from "./ListingAside";
import { ListingGallery } from "./ListingGallery";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function BackLink() {
  return (
    <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-fx-small font-bold text-fx-ink2 hover:text-fx-ink">
      <ArrowLeft className="size-4" />
      Marketplace
    </Link>
  );
}

export function ListingDetailPage() {
  const { id } = useParams({ from: "/_open/marketplace/$id" });
  const { data: listing } = useSuspenseQuery(listingQueryOptions(id));
  const me = useOptionalMe();
  const type = typeMeta(listing.listing_type);
  const direction = directionMeta(listing.direction);

  const details = [
    listing.quantity && { label: "Quantity", value: listing.quantity },
    listing.expires_at && { label: "Available until", value: formatDate(listing.expires_at) },
    { label: "Posted", value: formatDate(listing.created_at) },
  ].filter((d): d is { label: string; value: string } => !!d);

  return (
    <>
      <BackLink />
      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={direction.tone}>{direction.badge}</Badge>
            {listing.one_off && <Badge tone="slate">{ONE_OFF.badge}</Badge>}
            <Badge tone={type.tone}>{type.label}</Badge>
            <span className="text-fx-small font-bold text-fx-ink2">{categoryLabel(listing.category)}</span>
            {listing.subcategory && (
              <span className="text-fx-small text-fx-muted">· {subcategoryLabel(listing.category, listing.subcategory)}</span>
            )}
            {listing.status === "closed" && <Badge tone="slate">Closed</Badge>}
          </div>
          <h1 className="mt-4 text-fx-display text-fx-ink">{listing.title}</h1>

          {listing.images && listing.images.length > 0 && (
            <div className="mt-8">
              <ListingGallery images={listing.images} title={listing.title} />
            </div>
          )}

          <p className="mt-8 max-w-2xl text-fx-lead whitespace-pre-line text-fx-ink2">{listing.description}</p>

          <dl className="mt-10 grid gap-4 border-t border-fx-line pt-8 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="font-fx-display text-fx-label text-fx-muted uppercase">{d.label}</dt>
                <dd className="mt-2 text-fx-body font-bold text-fx-ink">{d.value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <ListingAside listing={listing} me={me} />
      </div>
    </>
  );
}

export function ListingNotFound() {
  return (
    <>
      <BackLink />
      <EmptyState
        className="mt-8"
        title="This listing is gone"
        description="It was removed, or the link is wrong. Plenty of others are waiting in the marketplace."
        action={<ButtonLink to="/marketplace">Browse the marketplace</ButtonLink>}
      />
    </>
  );
}
