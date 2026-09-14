import { createFileRoute, redirect } from "@tanstack/react-router";
import { meQueryOptions } from "@/lib/auth";
import { listingQueryOptions } from "@/features/listings/api";
import { EditListingPage } from "@/features/listings/form/EditListingPage";

export const Route = createFileRoute("/_auth/marketplace/$id/edit")({
  // Only a member of the posting organisation may edit (the API enforces it too).
  loader: async ({ context, params }) => {
    const [me, listing] = await Promise.all([
      context.queryClient.ensureQueryData(meQueryOptions),
      context.queryClient.ensureQueryData(listingQueryOptions(params.id)),
    ]);
    if (!me.organizations.some((o) => o.organization_id === listing.organization.id)) {
      throw redirect({ to: "/marketplace/$id", params: { id: params.id } });
    }
  },
  component: EditListingPage,
});
