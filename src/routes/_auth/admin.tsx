import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAdmin, meQueryOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";
import { TabLink, TabList } from "@/components/ui/Tabs";

// Only system admins. The API refuses everyone else on every /admin endpoint; this
// saves them a page that would answer 403 six times over.
export const Route = createFileRoute("/_auth/admin")({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions);
    if (!isAdmin(me)) throw redirect({ to: "/" });
  },
  component: AdminSpace,
});

function AdminSpace() {
  return (
    <>
      <PageHeader
        title="Admin"
        lede="The whole platform, list by list — searchable, filterable, and sorted by the database rather than by the page."
      />

      <TabList label="Admin sections" className="mt-8">
        <TabLink to="/admin/organizations">Organisations</TabLink>
        <TabLink to="/admin/networks">Networks</TabLink>
        <TabLink to="/admin/claims">Claims</TabLink>
        <TabLink to="/admin/feedbacks">Feedbacks</TabLink>
      </TabList>

      <div className="mt-8">
        <Outlet />
      </div>
    </>
  );
}
