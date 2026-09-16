import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, X } from "lucide-react";
import type { ResolvedLocation } from "@/features/explore/location";
import { token } from "@/features/explore/map/mapTokens";
import { PointsMap, type MapPoint } from "@/features/explore/map/PointsMap";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { orgKindLabel } from "@/features/organizations/kinds";
import type { DirectoryMapOrganization } from "./types";

function Legend() {
  return (
    <div className="pointer-events-none absolute top-3 left-3 z-10 rounded-fx border border-fx-line bg-fx-paper/95 px-3 py-2.5 shadow-sm backdrop-blur">
      <ul className="grid gap-1.5 text-fx-small text-fx-ink2">
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-fx-emphasis" />
          On FABRIX
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-fx-amber" />
          Claimable
        </li>
      </ul>
    </div>
  );
}

/** The directory on a map: one pill per organisation. */
export function DirectoryMap({
  organizations,
  location,
  claimedById,
}: {
  organizations: DirectoryMapOrganization[];
  location: ResolvedLocation;
  /** The map payload leaves `claimed` out, so the list view's knowledge is passed in. */
  claimedById?: Map<string, boolean>;
}) {
  // Ephemeral: the marker someone clicked.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const points = useMemo(() => {
    const on = token("--color-fx-emphasis", "#6c4cf1");
    const claimable = token("--color-fx-amber", "#c07d15");
    return organizations.flatMap<MapPoint>((org) =>
      org.lon == null || org.lat == null
        ? []
        : [{ id: org.id, lon: org.lon, lat: org.lat, color: claimedById?.get(org.id) === false ? claimable : on, label: org.name }],
    );
  }, [organizations, claimedById]);

  const selected = organizations.find((org) => org.id === selectedId) ?? null;

  return (
    <PointsMap
      points={points}
      location={location}
      selectedId={selectedId}
      onSelect={setSelectedId}
      legend={<Legend />}
      emptyTitle="Nothing to show on the map"
      emptyDescription="These organisations have no address yet, so they cannot be placed."
    >
      {selected && (
        <div className="absolute right-3 bottom-3 left-3 z-10 rounded-fx-lg border border-fx-line bg-fx-paper p-4 shadow-lg shadow-fx-ink/10 sm:left-auto sm:w-80">
          <div className="flex items-start justify-between gap-3">
            <Badge tone={claimedById?.get(selected.id) === false ? "amber" : "violet"}>
              {claimedById?.get(selected.id) === false ? "Claimable" : "On FABRIX"}
            </Badge>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close"
              className="-mt-1 -mr-1 rounded-fx p-1 text-fx-muted hover:bg-fx-panel hover:text-fx-ink"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-3 flex items-start gap-3">
            <Avatar name={selected.name} src={selected.image_url} />
            <div className="min-w-0">
              <Link
                to="/organizations/$id"
                params={{ id: selected.slug || selected.id }}
                preload="intent"
                className="block text-fx-heading text-fx-ink hover:text-fx-emphasis"
              >
                {selected.name}
              </Link>
              <p className="mt-1 text-fx-small text-fx-muted">{orgKindLabel(selected.kind)}</p>
              {selected.address && (
                <p className="mt-1 flex items-center gap-1.5 text-fx-small text-fx-ink2">
                  <MapPin aria-hidden className="size-3.5 shrink-0" />
                  {selected.address}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </PointsMap>
  );
}
