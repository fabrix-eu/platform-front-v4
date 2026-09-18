import { createFileRoute } from "@tanstack/react-router";
import { OrganizationsAdmin } from "@/features/admin/OrganizationsAdmin";
import { adminSearchSchema } from "@/features/admin/search";

export const Route = createFileRoute("/_auth/admin/organizations")({
  validateSearch: adminSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <OrganizationsAdmin
      search={search}
      onChange={(patch) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })}
    />
  );
}
