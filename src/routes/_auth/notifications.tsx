import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { NotificationsPage } from "@/features/notifications/NotificationsPage";

const searchSchema = z.object({ filter: z.enum(["all", "unread"]).optional() });

export const Route = createFileRoute("/_auth/notifications")({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { filter = "all" } = Route.useSearch();
  const navigate = Route.useNavigate();

  return <NotificationsPage filter={filter} onFilterChange={(next) => navigate({ search: { filter: next }, replace: true })} />;
}
