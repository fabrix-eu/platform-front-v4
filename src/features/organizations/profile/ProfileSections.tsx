import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Lightbox } from "@/components/ui/Lightbox";
import { orgKindLabel } from "../kinds";
import { relationLabel } from "../relations";
import type { OrganizationPhoto, OrganizationProfile } from "../types";

export function ProfileSection({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-fx-heading text-fx-ink">
        {title}
        {count !== undefined && <span className="ml-2 font-normal text-fx-muted">{count}</span>}
      </h2>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export function AboutSection({ org }: { org: OrganizationProfile }) {
  if (!org.description) return null;
  return (
    <ProfileSection title="About">
      <p className="max-w-2xl text-fx-lead whitespace-pre-line text-fx-ink2">{org.description}</p>
    </ProfileSection>
  );
}

export function PhotosSection({ photos }: { photos: OrganizationPhoto[] }) {
  // Ephemeral: which photo is open, if any.
  const [opened, setOpened] = useState<number | null>(null);
  if (photos.length === 0) return null;

  const sorted = [...photos].sort((a, b) => a.position - b.position);

  return (
    <ProfileSection title="Photos" count={photos.length}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sorted.map((photo, index) => (
          <figure key={photo.id} className="overflow-hidden rounded-fx bg-fx-panel">
            <button
              type="button"
              onClick={() => setOpened(index)}
              aria-label={photo.caption ? `Open: ${photo.caption}` : `Open photo ${index + 1}`}
              className="block w-full"
            >
              <img
                src={photo.url}
                alt={photo.caption ?? ""}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition hover:brightness-95"
              />
            </button>
            {photo.caption && <figcaption className="px-3 py-2 text-fx-small text-fx-ink2">{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>

      <Lightbox
        images={sorted.map((photo) => ({ url: photo.url, alt: photo.caption ?? "" }))}
        startAt={opened ?? 0}
        open={opened !== null}
        onOpenChange={(open) => !open && setOpened(null)}
      />
    </ProfileSection>
  );
}

// The organisations it works with, and how — each relation read from this profile's side.
export function ConnectionsSection({ org }: { org: OrganizationProfile }) {
  if (org.related_organizations.length === 0) return null;
  const labelsFor = (otherId: string) =>
    org.relations
      .filter((r) => r.from_organization_id === otherId || r.to_organization_id === otherId)
      .map((r) => relationLabel(r.relation_type));

  return (
    <ProfileSection title="Connections" count={org.related_organizations.length}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {org.related_organizations.map((other) => (
          <li key={other.id}>
            <Link
              to="/organizations/$id"
              params={{ id: other.slug || other.id }}
              preload="intent"
              className="group flex items-center gap-3 rounded-fx border border-fx-line p-3 transition hover:border-fx-line2"
            >
              <Avatar name={other.name} src={other.image_url} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-fx-body font-bold text-fx-ink group-hover:text-fx-emphasis">{other.name}</span>
                <span className="block truncate text-fx-small text-fx-muted">
                  {[...new Set(labelsFor(other.id))].join(" · ") || orgKindLabel(other.kind)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
