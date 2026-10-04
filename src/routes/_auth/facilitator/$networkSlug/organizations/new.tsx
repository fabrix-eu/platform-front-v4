import { createFileRoute } from "@tanstack/react-router";
import { networkQueryOptions } from "@/features/facilitator/api";
import { AddOrganisationPage } from "@/features/facilitator/add/AddOrganisationPage";

export const Route = createFileRoute("/_auth/facilitator/$networkSlug/organizations/new")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(networkQueryOptions(params.networkSlug)),
  component: RouteComponent,
});

function RouteComponent() {
  const { networkSlug } = Route.useParams();
  return <AddOrganisationPage networkSlug={networkSlug} />;
}
