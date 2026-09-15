import { createFileRoute } from "@tanstack/react-router";
import { organizationProfileQueryOptions } from "@/features/organizations/api";
import { ProfileEditorPage } from "@/features/organizations/editor/ProfileEditorPage";
import { profileEditorSearchSchema } from "@/features/organizations/editor/search";

export const Route = createFileRoute("/_auth/$orgSlug/profile")({
  validateSearch: profileEditorSearchSchema,
  // Members get the organisation with its private data (the API leaves it out for others).
  loader: ({ context, params }) => context.queryClient.ensureQueryData(organizationProfileQueryOptions(params.orgSlug)),
  component: ProfileEditorPage,
});
