import { Link } from "@tanstack/react-router";
import { MapPin, Network } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { orgKindLabel } from "@/features/organizations/kinds";
import type { DirectoryOrganization } from "./types";

function Meta({ org }: { org: DirectoryOrganization }) {
  return (
    <>
      {org.address && (
        <span className="flex min-w-0 items-center gap-1.5">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate">{org.address}</span>
        </span>
      )}
      {org.relations_count > 0 && (
        <span className="flex items-center gap-1.5">
          <Network aria-hidden className="size-3.5 shrink-0" />
          {org.relations_count} connection{org.relations_count === 1 ? "" : "s"}
        </span>
      )}
    </>
  );
}

export function OrganizationCard({ org }: { org: DirectoryOrganization }) {
  return (
    <Link to="/organizations/$id" params={{ id: org.slug || org.id }} preload="intent" className="group block h-full">
      <Card className="flex h-full flex-col p-5">
        <div className="flex items-start gap-3">
          <Avatar name={org.name} src={org.image_url} />
          {/* The badge goes under the name, never beside it: it was squeezing long names. */}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-fx-heading text-fx-ink group-hover:text-fx-emphasis">{org.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-fx-small text-fx-muted">{orgKindLabel(org.kind)}</span>
              {!org.claimed && <Badge tone="violet">Claimable</Badge>}
            </div>
          </div>
        </div>

        {/* Kept whether or not there is a description, so every card ends at the same place. */}
        <p className="mt-3 line-clamp-2 min-h-9 text-fx-small text-fx-ink2">{org.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-fx-line pt-3.5 text-fx-small text-fx-ink2">
          <Meta org={org} />
        </div>
      </Card>
    </Link>
  );
}

export function OrganizationRow({ org }: { org: DirectoryOrganization }) {
  return (
    <Link
      to="/organizations/$id"
      params={{ id: org.slug || org.id }}
      preload="intent"
      className="group flex items-center gap-4 rounded-fx border border-fx-line bg-fx-paper px-4 py-3.5 hover:border-fx-emphasis"
    >
      <Avatar name={org.name} src={org.image_url} size="sm" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-fx-body font-bold text-fx-ink group-hover:text-fx-emphasis">{org.name}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-fx-small text-fx-muted">
          {orgKindLabel(org.kind)}
          <Meta org={org} />
        </span>
      </span>
      {!org.claimed && <Badge tone="violet">Claimable</Badge>}
    </Link>
  );
}

export function OrganizationGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-44 animate-pulse rounded-fx-lg bg-fx-panel" />
      ))}
    </div>
  );
}
