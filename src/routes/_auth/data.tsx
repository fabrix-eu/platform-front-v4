import { createFileRoute } from "@tanstack/react-router";
import { DataPage } from "@/features/data/DataPage";
import { naceCategoriesQueryOptions } from "@/features/data/api";
import { dataSearchSchema } from "@/features/data/search";

// Signed in only: these registers name individual businesses with their address, and
// the endpoints behind them have always asked for a session.
export const Route = createFileRoute("/_auth/data")({
  validateSearch: dataSearchSchema,
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
