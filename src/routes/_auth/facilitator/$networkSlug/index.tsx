import { createFileRoute } from "@tanstack/react-router";
import { NetworkDashboardPage } from "@/features/facilitator/NetworkDashboardPage";
import { networkSearchSchema } from "@/features/facilitator/search";

export const Route = createFileRoute("/_auth/facilitator/$networkSlug/")({
  validateSearch: networkSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { networkSlug } = Route.useParams();
  const { tab = "overview", q, tasks = "open" } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <NetworkDashboardPage
      networkSlug={networkSlug}
      tab={tab}
      q={q}
      tasks={tasks}
      onSearchChange={(next) => navigate({ search: (prev) => ({ ...prev, ...next }), replace: true })}
    />
  );
}
