import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "@/features/events/EventsPage";
import { eventsSearchSchema } from "@/features/events/search";

export const Route = createFileRoute("/_auth/events/")({
  validateSearch: eventsSearchSchema,
  component: EventsPage,
});
