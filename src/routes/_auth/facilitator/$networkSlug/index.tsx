import { createFileRoute } from "@tanstack/react-router";
import { NetworkDashboardPage } from "@/features/facilitator/NetworkDashboardPage";
import { networkSearchSchema } from "@/features/facilitator/search";

export const Route = createFileRoute("/_auth/facilitator/$networkSlug/")({
  validateSearch: networkSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { networkSlug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <NetworkDashboardPage
      networkSlug={networkSlug}
      search={search}
      onSearchChange={(patch) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })}
    />
  );
}
