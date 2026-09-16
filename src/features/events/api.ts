import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { api, type Paginated } from "@/lib/api";
import type { EventParticipant, EventPayload, FabrixEvent, RsvpStatus } from "./types";

/** Query params of GET /events (has_scope names; `upcoming`/`past` carry their own order). */
export type EventFilters = Record<string, string | number | boolean | undefined>;

export const EVENTS_KEY = ["events"];

export const eventsInfiniteQueryOptions = (filters: EventFilters) =>
  infiniteQueryOptions({
    queryKey: ["events", "list", filters],
    queryFn: ({ pageParam }) => api.get<Paginated<FabrixEvent>>("/events", { ...filters, page: pageParam, per_page: 24 }),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.next_page ?? undefined,
  });

/** The map needs them all at once: `view=map` skips pagination (2000 max). */
export const eventsMapQueryOptions = (filters: EventFilters) =>
  queryOptions({
    queryKey: ["events", "map", filters],
    queryFn: () => api.get<Paginated<FabrixEvent>>("/events", { ...filters, view: "map" }),
  });

export const eventQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["events", "detail", id],
    queryFn: () => api.get<FabrixEvent>(`/events/${id}`),
  });

/** Any member of an organisation may add one; only its creator (or an admin) may change it. */
export const createEvent = (event: EventPayload) => api.post<FabrixEvent>("/events", { event });

export const updateEvent = (id: string, event: EventPayload) => api.patch<FabrixEvent>(`/events/${id}`, { event });

export const deleteEvent = (id: string) => api.delete<FabrixEvent>(`/events/${id}`);

export const participantsQueryOptions = (eventId: string) =>
  queryOptions({
    queryKey: ["events", "participants", eventId],
    queryFn: () => api.get<EventParticipant[]>(`/events/${eventId}/participants`),
  });

/** One RSVP per person: posting again updates it. `status` is not nested. */
export const rsvp = (eventId: string, status: RsvpStatus) => api.post<EventParticipant>(`/events/${eventId}/participants`, { status });

export const cancelRsvp = (eventId: string, participantId: string) => api.delete<void>(`/events/${eventId}/participants/${participantId}`);
