import { Link } from "@tanstack/react-router";
import { Clock, Globe, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { FabrixEvent } from "./types";

/** "19 / SEPT" — the block people scan a list of events by. */
export function EventDate({ iso, className }: { iso: string; className?: string }) {
  const date = new Date(iso);
  return (
    <time
      dateTime={iso}
      className={cn("flex size-14 shrink-0 flex-col items-center justify-center rounded-fx bg-fx-emphasis-soft text-fx-emphasis", className)}
    >
      <span className="font-fx-display text-fx-heading leading-none">{date.toLocaleDateString("en-GB", { day: "numeric" })}</span>
      <span className="text-fx-label uppercase">{date.toLocaleDateString("en-GB", { month: "short" })}</span>
    </time>
  );
}

export function eventTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

export function EventPlace({ event }: { event: FabrixEvent }) {
  return event.online ? (
    <span className="flex items-center gap-1.5">
      <Globe aria-hidden className="size-3.5 shrink-0" />
      Online
    </span>
  ) : (
    <span className="flex min-w-0 items-center gap-1.5">
      <MapPin aria-hidden className="size-3.5 shrink-0" />
      <span className="truncate">{event.address ?? "Somewhere"}</span>
    </span>
  );
}

const isPast = (event: FabrixEvent) => new Date(event.happens_at) < new Date();

export function EventCard({ event }: { event: FabrixEvent }) {
  return (
    <Link to="/events/$eventId" params={{ eventId: event.id }} preload="intent" className="group block h-full">
      <Card className="flex h-full flex-col p-0">
        {/* The date sits on the banner, so the title gets the whole width. Without a
            photo the banner is just a band — no need for it to take a third of the card. */}
        <div className="relative">
          {event.image_url ? (
            <img src={event.image_url} alt="" className="aspect-[16/9] w-full rounded-t-fx-lg object-cover" />
          ) : (
            <div aria-hidden className="h-16 w-full rounded-t-fx-lg bg-fx-emphasis-soft" />
          )}
          <EventDate iso={event.happens_at} className="absolute -bottom-5 left-4 bg-fx-paper shadow-sm ring-1 ring-fx-line" />
          {isPast(event) && (
            <span className="absolute top-3 right-3">
              <Badge tone="slate">Past</Badge>
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 pt-8">
          {/* Two lines at most: a long title must not make this card taller than its neighbours. */}
          <h3 className="line-clamp-2 text-fx-heading text-fx-ink group-hover:text-fx-emphasis">{event.title}</h3>
          {event.description && <p className="mt-2 line-clamp-2 text-fx-small text-fx-ink2">{event.description}</p>}

          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-fx-line pt-3.5 text-fx-small text-fx-ink2">
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5 shrink-0" />
              {eventTime(event.happens_at)}
            </span>
            <EventPlace event={event} />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function EventRow({ event }: { event: FabrixEvent }) {
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: event.id }}
      preload="intent"
      className="group flex items-center gap-4 rounded-fx border border-fx-line bg-fx-paper px-4 py-3.5 hover:border-fx-emphasis"
    >
      <EventDate iso={event.happens_at} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-fx-body font-bold text-fx-ink group-hover:text-fx-emphasis">{event.title}</span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-fx-small text-fx-muted">
          {eventTime(event.happens_at)}
          <EventPlace event={event} />
        </span>
      </span>
      {isPast(event) && <Badge tone="slate">Past</Badge>}
    </Link>
  );
}

export function EventGridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-72 animate-pulse rounded-fx-lg bg-fx-panel" />
      ))}
    </div>
  );
}
