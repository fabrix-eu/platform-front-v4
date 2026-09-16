import { createFileRoute } from "@tanstack/react-router";
import { organizationProfileQueryOptions } from "@/features/organizations/api";
import { ConnectionsPage } from "@/features/relations/ConnectionsPage";

export const Route = createFileRoute("/_auth/$orgSlug/relations")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(organizationProfileQueryOptions(params.orgSlug)),
  component: ConnectionsPage,
});
