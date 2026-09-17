import { createFileRoute } from "@tanstack/react-router";
import { networkOrganizationQueryOptions } from "@/features/facilitator/record/api";
import { RecordPage } from "@/features/facilitator/record/RecordPage";

export const Route = createFileRoute("/_auth/facilitator/$networkSlug/organizations/$recordId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(networkOrganizationQueryOptions(params.networkSlug, params.recordId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { networkSlug, recordId } = Route.useParams();
  return <RecordPage networkSlug={networkSlug} recordId={recordId} />;
}
