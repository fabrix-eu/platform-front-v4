import { Link } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, typeMeta } from "./taxonomy";
import type { Listing } from "./types";

function Thumbnail({ listing, className }: { listing: Listing; className: string }) {
  return listing.thumbnail_url ? (
    <img src={listing.thumbnail_url} alt="" loading="lazy" className={`${className} object-cover`} />
  ) : (
    <div className={`${className} flex items-center justify-center bg-fx-panel`}>
      <ImageIcon aria-hidden className="size-8 text-fx-line2" strokeWidth={1.5} />
    </div>
  );
}

export function ListingCard({ listing }: { listing: Listing }) {
  const type = typeMeta(listing.listing_type);
  return (
    <Link
      to="/marketplace/$id"
      params={{ id: listing.id }}
      // Not "render": a page of 24 cards would fetch 24 listings nobody opened.
      preload="intent"
      className="group flex flex-col overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper transition hover:border-fx-line2 hover:shadow-lg hover:shadow-fx-ink/5"
    >
      <Thumbnail listing={listing} className="aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={type.tone}>{type.label}</Badge>
          <span className="truncate text-fx-small text-fx-muted">{categoryLabel(listing.category)}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-fx-heading text-fx-ink group-hover:text-fx-emphasis">{listing.title}</h3>
        <p className="mt-2 line-clamp-2 text-fx-small text-fx-ink2">{listing.description}</p>
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2.5 border-t border-fx-line pt-4">
            <Avatar name={listing.organization.name} src={listing.organization.image_url} size="sm" />
            <span className="min-w-0 truncate text-fx-small font-bold text-fx-ink2">{listing.organization.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ListingRow({ listing }: { listing: Listing }) {
  const type = typeMeta(listing.listing_type);
  return (
    <Link
      to="/marketplace/$id"
      params={{ id: listing.id }}
      // Not "render": a page of 24 cards would fetch 24 listings nobody opened.
      preload="intent"
      className="group flex items-center gap-4 rounded-fx border border-fx-line bg-fx-paper p-3 pr-5 transition hover:border-fx-line2"
    >
      <Thumbnail listing={listing} className="size-16 shrink-0 rounded-fx-sm" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-fx-body font-bold text-fx-ink group-hover:text-fx-emphasis">{listing.title}</h3>
        <p className="mt-0.5 truncate text-fx-small text-fx-muted">
          {listing.organization.name} · {categoryLabel(listing.category)}
        </p>
      </div>
      <Badge tone={type.tone} className="hidden shrink-0 sm:inline-flex">
        {type.label}
      </Badge>
    </Link>
  );
}

export function ListingGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-fx-lg bg-fx-line" />
      ))}
    </div>
  );
}
