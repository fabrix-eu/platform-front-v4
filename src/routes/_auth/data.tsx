import { createFileRoute, redirect } from "@tanstack/react-router";
import { canSeeCityData, meQueryOptions } from "@/lib/auth";
import { DataPage } from "@/features/data/DataPage";
import { naceCategoriesQueryOptions } from "@/features/data/api";
import { dataSearchSchema } from "@/features/data/search";

// These registers name individual businesses with their address, so they are open to
// the people who study the ecosystem — admins, facilitators, and accounts with no
// organisation — and not to the organisations competing inside it. The API refuses the
// same people; this only saves them a page that would answer 403.
export const Route = createFileRoute("/_auth/data")({
  validateSearch: dataSearchSchema,
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions);
    if (!canSeeCityData(me)) throw redirect({ to: "/" });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(naceCategoriesQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <DataPage
      search={search}
      onChange={(patch) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })}
    />
  );
}
