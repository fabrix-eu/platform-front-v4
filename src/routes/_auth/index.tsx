import { createFileRoute, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { meQueryOptions } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

export const Route = createFileRoute("/_auth/")({
  // A member's home is their organisation's dashboard.
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions);
    const org = resolveCurrentOrg(me);
    if (org) throw redirect({ to: "/$orgSlug/dashboard", params: { orgSlug: org.organization_slug } });
  },
  component: HomePage,
});

// Signed in, no organisation: everything on FABRIX starts with one.
function HomePage() {
  const { data: me } = useSuspenseQuery(meQueryOptions);

  return (
    <>
      <PageHeader title={`Welcome, ${me.name}`} lede="Find partners, materials and services in the circular textile ecosystem." />
      <EmptyState
        className="mt-10"
        title="Add your organisation"
        description="Create its profile, or claim the one that already exists — then list what you offer and invite the partners you work with."
        action={
          <ButtonLink to="/organizations/new">
            <Plus className="size-4" strokeWidth={2.6} />
            Add your organisation
          </ButtonLink>
        }
      />
    </>
  );
}
