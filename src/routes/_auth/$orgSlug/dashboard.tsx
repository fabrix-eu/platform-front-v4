import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { organizationProfileQueryOptions } from "@/features/organizations/api";

export const Route = createFileRoute("/_auth/$orgSlug/dashboard")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(organizationProfileQueryOptions(params.orgSlug)),
  component: DashboardPage,
});
