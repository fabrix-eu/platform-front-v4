import { createFileRoute } from "@tanstack/react-router";
import { organizationProfileQueryOptions } from "@/features/organizations/api";
import { OrganizationNotFound, ProfilePage } from "@/features/organizations/profile/ProfilePage";

export const Route = createFileRoute("/_open/organizations/$id")({
  // $id is a slug or a UUID — the API accepts both.
  loader: ({ context, params }) => context.queryClient.ensureQueryData(organizationProfileQueryOptions(params.id)),
  component: ProfilePage,
  errorComponent: OrganizationNotFound,
});
