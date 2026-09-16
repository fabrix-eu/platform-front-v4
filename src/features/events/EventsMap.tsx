import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ResolvedLocation } from "@/features/explore/location";
import { token } from "@/features/explore/map/mapTokens";
import { PointsMap, type MapPoint } from "@/features/explore/map/PointsMap";
import { Badge } from "@/components/ui/Badge";
import { EventDate, EventPlace, eventTime } from "./EventCard";
import type { FabrixEvent } from "./types";

/** Events on a map. Online ones have no place, so they are not on it. */
export function EventsMap({ events, location }: { events: FabrixEvent[]; location: ResolvedLocation }) {
  // Ephemeral: the marker someone clicked.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const points = useMemo(() => {
    const soon = token("--color-fx-emphasis", "#6c4cf1");
    const over = token("--color-fx-muted", "#6f6f7b");
    const now = Date.now();
    return events.flatMap<MapPoint>((event) =>
      event.lon == null || event.lat == null
        ? []
        : [
            {
              id: event.id,
              lon: event.lon,
              lat: event.lat,
              color: new Date(event.happens_at).getTime() < now ? over : soon,
              label: event.title,
            },
          ],
    );
  }, [events]);

  const selected = events.find((event) => event.id === selectedId) ?? null;

  return (
    <PointsMap
      points={points}
      location={location}
      selectedId={selectedId}
      onSelect={setSelectedId}
      emptyTitle="Nothing to show on the map"
      emptyDescription="These events are online, or have no address yet."
    >
      {selected && (
        <div className="absolute right-3 bottom-3 left-3 z-10 rounded-fx-lg border border-fx-line bg-fx-paper p-4 shadow-lg shadow-fx-ink/10 sm:left-auto sm:w-80">
          <div className="flex items-start justify-between gap-3">
            {new Date(selected.happens_at) < new Date() ? <Badge tone="slate">Past</Badge> : <Badge tone="violet">Upcoming</Badge>}
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
            <EventDate iso={selected.happens_at} />
            <div className="min-w-0">
              <Link to="/events/$eventId" params={{ eventId: selected.id }} preload="intent" className="block text-fx-heading text-fx-ink hover:text-fx-emphasis">
                {selected.title}
              </Link>
              <p className="mt-1 text-fx-small text-fx-muted">{eventTime(selected.happens_at)}</p>
              <p className="mt-1 text-fx-small text-fx-ink2">
                <EventPlace event={selected} />
              </p>
            </div>
          </div>
        </div>
      )}
    </PointsMap>
  );
}
