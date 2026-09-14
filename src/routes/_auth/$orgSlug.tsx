import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { meQueryOptions } from "@/lib/auth";

// Org pages are for its members. The public profile of an org you don't belong to
// will live under /organizations/$id.
export const Route = createFileRoute("/_auth/$orgSlug")({
  beforeLoad: async ({ context, params }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions);
    if (!me.organizations.some((o) => o.organization_slug === params.orgSlug)) {
      throw redirect({ to: "/" });
    }
  },
  component: Outlet,
});
