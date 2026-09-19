import { createFileRoute } from "@tanstack/react-router";
import { FeedbacksAdmin } from "@/features/admin/FeedbacksAdmin";
import { adminSearchSchema } from "@/features/admin/search";

export const Route = createFileRoute("/_auth/admin/feedbacks")({
  validateSearch: adminSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <FeedbacksAdmin
      search={search}
      onChange={(patch) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false })}
    />
  );
}
