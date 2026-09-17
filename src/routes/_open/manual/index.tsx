import { createFileRoute, redirect } from "@tanstack/react-router";
import { MANUAL_PAGES } from "@/features/manual/contents";

// The manual opens on its first page rather than on a table of contents the side
// nav already shows.
export const Route = createFileRoute("/_open/manual/")({
  beforeLoad: () => {
    throw redirect({ to: "/manual/$page", params: { page: MANUAL_PAGES[0] } });
  },
});
