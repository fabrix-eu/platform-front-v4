import { createFileRoute } from "@tanstack/react-router";
import { NetworksAdmin } from "@/features/admin/NetworksAdmin";
import { adminSearchSchema } from "@/features/admin/search";

export const Route = createFileRoute("/_auth/admin/networks")({
  validateSearch: adminSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <NetworksAdmin
      search={search}
      onChange={(patch) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })}
    />
  );
}
