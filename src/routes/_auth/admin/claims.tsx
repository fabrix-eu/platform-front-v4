import { createFileRoute } from "@tanstack/react-router";
import { ClaimsAdmin } from "@/features/admin/ClaimsAdmin";
import { adminSearchSchema } from "@/features/admin/search";

export const Route = createFileRoute("/_auth/admin/claims")({
  validateSearch: adminSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <ClaimsAdmin
      search={search}
      onChange={(patch) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })}
    />
  );
}
