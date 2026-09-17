import { createFileRoute, redirect } from "@tanstack/react-router";
import { meQueryOptions } from "@/lib/auth";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

// Each network has its own dashboard, and the sidebar lists them all; this entry
// just opens the first one. It only renders when a facilitator has none yet.
export const Route = createFileRoute("/_auth/facilitator/")({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions);
    const first = me.networks[0];
    if (first) throw redirect({ to: "/facilitator/$networkSlug", params: { networkSlug: first.slug } });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageHeader title="Facilitator" lede="The networks you steer appear here." />
      <EmptyState
        className="mt-8"
        title="No network yet"
        description="A network is the shared CRM over the organisations you follow. The FABRIX team sets yours up — write to adrian@osmosnetwork.com to get started."
      />
    </>
  );
}
