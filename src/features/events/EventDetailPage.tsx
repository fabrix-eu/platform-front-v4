import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Globe, MapPin, Trash2 } from "lucide-react";
import { useCurrentOrg } from "@/lib/activeOrg";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { deleteEvent, eventQueryOptions, participantsQueryOptions } from "./api";
import { EditEventDialog } from "./form/EditEventDialog";
import { RsvpButtons } from "./RsvpButtons";
import { RSVP_LABELS } from "./types";

export function EventDetailPage() {
  const { eventId } = useParams({ from: "/_auth/events/$eventId" });
  const { data: event } = useSuspenseQuery(eventQueryOptions(eventId));
  const { me } = useCurrentOrg();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: participants } = useQuery(participantsQueryOptions(eventId));

  const past = new Date(event.happens_at) < new Date();
  const mine = event.created_by_id === me.id || me.role === "admin";
  const going = (participants ?? []).filter((participant) => participant.status === "going");

  const remove = useMutation({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: () => {
      toast(`“${event.title}” was deleted`);
      navigate({ to: "/events" });
    },
  });

  return (
    <>
      <Link to="/events" className="inline-flex items-center gap-1.5 text-fx-small font-bold text-fx-ink2 hover:text-fx-emphasis">
        <ArrowLeft aria-hidden className="size-4" />
        All events
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          {event.image_url && <img src={event.image_url} alt="" className="mb-6 aspect-[16/9] w-full rounded-fx-lg object-cover" />}
          <div className="flex flex-wrap items-center gap-2">
            {event.online && <Badge tone="indigo">Online</Badge>}
            {past && <Badge tone="slate">Past</Badge>}
          </div>
          <h1 className="mt-3 text-fx-display text-fx-ink">{event.title}</h1>
          <div className="mt-4 space-y-2 text-fx-body text-fx-ink2">
            <p className="flex items-center gap-2">
              <CalendarDays aria-hidden className="size-4 shrink-0 text-fx-muted" />
              <time dateTime={event.happens_at}>
                {new Date(event.happens_at).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </time>
            </p>
            {event.online ? (
              <p className="flex items-center gap-2">
                <Globe aria-hidden className="size-4 shrink-0 text-fx-muted" />
                {event.online_url ? (
                  <a href={event.online_url} target="_blank" rel="noopener noreferrer" className="font-bold text-fx-emphasis underline-offset-4 hover:underline">
                    Join online
                  </a>
                ) : (
                  "Online"
                )}
              </p>
            ) : (
              <p className="flex items-center gap-2">
                <MapPin aria-hidden className="size-4 shrink-0 text-fx-muted" />
                {event.address}
              </p>
            )}
          </div>
          {event.description && <p className="mt-6 max-w-prose text-fx-body whitespace-pre-line text-fx-ink2">{event.description}</p>}

          {mine && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-fx-line pt-6">
              <EditEventDialog
                event={event}
                trigger={<Button variant="secondary">Edit event</Button>}
              />
              <Button
                variant="ghost"
                className="text-fx-muted hover:bg-fx-rose-soft hover:text-fx-rose"
                disabled={remove.isPending}
                onClick={() => {
                  if (window.confirm(`Delete “${event.title}”? This cannot be undone.`)) remove.mutate();
                }}
              >
                <Trash2 className="size-4" />
                {remove.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          <Card>
            <Eyebrow>Are you coming?</Eyebrow>
            <div className="mt-4">
              <RsvpButtons eventId={eventId} past={past} />
            </div>
          </Card>

          <Card>
            <Eyebrow>{going.length === 0 ? "Nobody yet" : `${going.length} going`}</Eyebrow>
            {going.length > 0 && (
              <ul className="mt-4 space-y-3">
                {going.slice(0, 8).map((participant) => (
                  <li key={participant.id} className="flex items-center gap-3">
                    <Avatar name={participant.user.name} src={participant.user.image_url} kind="person" size="sm" />
                    <span className="min-w-0 flex-1 truncate text-fx-small text-fx-ink">{participant.user.name}</span>
                    <span className="text-fx-small text-fx-muted">{RSVP_LABELS[participant.status]}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}
