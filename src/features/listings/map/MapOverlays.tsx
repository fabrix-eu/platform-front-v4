import { Link } from "@tanstack/react-router";
import { MapPin, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LISTING_TYPES, LISTING_TYPE_META, categoryLabel, typeMeta } from "../taxonomy";
import type { Listing } from "../types";

const DOT: Record<string, string> = {
  material: "bg-fx-green",
  capacity: "bg-fx-amber",
  service: "bg-fx-teal",
  product: "bg-fx-rose",
  distribution: "bg-fx-indigo",
};

/** What the colours on the map mean. */
export function MapLegend() {
  return (
    <div className="pointer-events-none absolute top-3 left-3 z-10 rounded-fx border border-fx-line bg-fx-paper/95 px-3 py-2.5 shadow-sm backdrop-blur">
      <ul className="grid gap-1.5">
        {LISTING_TYPES.map((type) => (
          <li key={type} className="flex items-center gap-2 text-fx-small text-fx-ink2">
            <span aria-hidden className={`size-2.5 rounded-full ${DOT[type]}`} />
            {LISTING_TYPE_META[type].label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The listing behind the pin someone just clicked. */
export function MapSelection({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const meta = typeMeta(listing.listing_type);
  const org = listing.organization;

  return (
    <div className="absolute right-3 bottom-3 left-3 z-10 rounded-fx-lg border border-fx-line bg-fx-paper p-4 shadow-lg shadow-fx-ink/10 sm:left-auto sm:w-80">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={meta.tone}>{meta.label}</Badge>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mt-1 -mr-1 rounded-fx p-1 text-fx-muted hover:bg-fx-panel hover:text-fx-ink"
        >
          <X className="size-4" />
        </button>
      </div>
      <Link
        to="/marketplace/$id"
        params={{ id: listing.id }}
        preload="intent"
        className="mt-2 block text-fx-heading text-fx-ink hover:text-fx-emphasis"
      >
        {listing.title}
      </Link>
      <p className="mt-1 text-fx-small text-fx-muted">{categoryLabel(listing.category)}</p>
      <div className="mt-3 flex items-center gap-2 border-t border-fx-line pt-3">
        <Avatar name={org.name} src={org.image_url} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-fx-small font-bold text-fx-ink">{org.name}</span>
          {org.address && (
            <span className="flex items-center gap-1 truncate text-fx-small text-fx-muted">
              <MapPin aria-hidden className="size-3 shrink-0" />
              {org.address}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
