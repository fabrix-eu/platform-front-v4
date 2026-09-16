import { createFileRoute, redirect } from "@tanstack/react-router";

// Members moved into the profile editor, as its Team tab.
export const Route = createFileRoute("/_auth/$orgSlug/settings/members")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$orgSlug/profile", params: { orgSlug: params.orgSlug }, search: { tab: "team" } });
  },
});
