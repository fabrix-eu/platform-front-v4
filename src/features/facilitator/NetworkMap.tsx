import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapPin, X } from "lucide-react";
import { meQueryOptions } from "@/lib/auth";
import { DEFAULT_RADIUS_KM, type ResolvedLocation } from "@/features/explore/location";
import { token } from "@/features/explore/map/mapTokens";
import { PointsMap, type MapPoint } from "@/features/explore/map/PointsMap";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { orgKindLabel } from "@/features/organizations/kinds";
import { HEALTH_LABELS, HEALTH_TONES, type Network, type NetworkOrganization } from "./types";

/** Health is the facilitator's own reading, so it is what the pins carry. */
function healthColour(health: string): string {
  switch (health) {
    case "excellent":
    case "good":
      return token("--color-fx-green", "#2a9d63");
    case "warning":
      return token("--color-fx-amber", "#c07d15");
    case "critical":
      return token("--color-fx-rose", "#cb4a86");
    default:
      return token("--color-fx-line2", "#dedce4");
  }
}

function Legend({ centredOn }: { centredOn: string | null }) {
  const rows = [
    { label: "Excellent / good", tone: "bg-fx-green" },
    { label: "Warning", tone: "bg-fx-amber" },
    { label: "Critical", tone: "bg-fx-rose" },
    { label: "Unknown", tone: "bg-fx-line2" },
  ];
  return (
    <div className="pointer-events-none absolute top-3 left-3 z-10 max-w-64 rounded-fx border border-fx-line bg-fx-paper/95 px-3 py-2.5 shadow-sm backdrop-blur">
      <p className="mb-1.5 font-fx-display text-fx-label text-fx-muted uppercase">Economic health</p>
      <ul className="grid gap-1.5 text-fx-small text-fx-ink2">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-2">
            <span aria-hidden className={`size-2.5 rounded-full ${row.tone}`} />
            {row.label}
          </li>
        ))}
      </ul>
      {centredOn && (
        <p className="mt-2 flex items-start gap-2 border-t border-fx-line pt-2 text-fx-label text-fx-muted">
          <span aria-hidden className="mt-0.5 size-2.5 shrink-0 rounded-full bg-fx-sky/40 ring-1 ring-fx-sky" />
          <span className="min-w-0">Area covered, centred on {centredOn}</span>
        </p>
      )}
    </div>
  );
}

/** The followed organisations on the map, inside the network's own territory. */
export function NetworkMap({ network, records }: { network: Network; records: NetworkOrganization[] }) {
  const { data: me } = useSuspenseQuery(meQueryOptions);
  // Ephemeral: the marker someone clicked.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // The centre set in Settings, and failing that the organisation that runs the
  // network — its coordinates travel on the session payload, which the network's
  // own `organization` field does not carry.
  const centre = useMemo(() => {
    if (network.center_lon != null && network.center_lat != null) {
      return { lon: network.center_lon, lat: network.center_lat, label: network.center_address ?? network.name };
    }
    const managing = me.networks.find((entry) => entry.slug === network.slug)?.organization;
    if (managing?.lon != null && managing.lat != null) {
      return { lon: managing.lon, lat: managing.lat, label: managing.name };
    }
    return null;
  }, [network, me.networks]);

  // The circle is the network's territory, not a search radius: this list is what
  // the facilitator added, wherever it sits.
  const location: ResolvedLocation = centre
    ? { active: true, lon: centre.lon, lat: centre.lat, radius: network.radius_km ?? DEFAULT_RADIUS_KM, label: centre.label }
    : { active: false, radius: DEFAULT_RADIUS_KM };

  const points = useMemo(
    () =>
      records.flatMap<MapPoint>((record) =>
        record.organization.lon == null || record.organization.lat == null
          ? []
          : [
              {
                id: record.id,
                lon: record.organization.lon,
                lat: record.organization.lat,
                color: healthColour(record.economic_health),
                label: record.organization.name,
              },
            ],
      ),
    [records],
  );

  const selected = records.find((record) => record.id === selectedId) ?? null;

  return (
    <PointsMap
      points={points}
      location={location}
      selectedId={selectedId}
      onSelect={setSelectedId}
      legend={<Legend centredOn={centre?.label ?? null} />}
      areaColor={token("--color-fx-sky", "#4f9fd8")}
      areaOpacity={0.14}
      emptyTitle="Nothing to place on the map"
      emptyDescription="The organisations you follow have no address yet, so they cannot be shown here."
    >
      {selected && (
        <div className="absolute right-3 bottom-3 left-3 z-10 rounded-fx-lg border border-fx-line bg-fx-paper p-4 shadow-lg shadow-fx-ink/10 sm:left-auto sm:w-80">
          <div className="flex items-start justify-between gap-3">
            <Badge tone={HEALTH_TONES[selected.economic_health] ?? "slate"}>
              {HEALTH_LABELS[selected.economic_health] ?? selected.economic_health}
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
            <Avatar name={selected.organization.name} src={selected.organization.image_url} />
            <div className="min-w-0">
              <Link
                to="/facilitator/$networkSlug/organizations/$recordId"
                params={{ networkSlug: network.slug, recordId: selected.id }}
                preload="intent"
                className="block text-fx-heading text-fx-ink hover:text-fx-emphasis"
              >
                {selected.organization.name}
              </Link>
              <p className="mt-1 text-fx-small text-fx-muted">{orgKindLabel(selected.organization.kind)}</p>
              {selected.organization.address && (
                <p className="mt-1 flex items-center gap-1.5 text-fx-small text-fx-ink2">
                  <MapPin aria-hidden className="size-3.5 shrink-0" />
                  {selected.organization.address}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </PointsMap>
  );
}
