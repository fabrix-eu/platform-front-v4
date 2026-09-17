import { createFileRoute } from "@tanstack/react-router";
import { eventQueryOptions } from "@/features/events/api";
import { EventDetailPage } from "@/features/events/EventDetailPage";

export const Route = createFileRoute("/_open/events/$eventId")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(eventQueryOptions(params.eventId)),
  component: EventDetailPage,
});
