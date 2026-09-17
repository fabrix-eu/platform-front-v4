import { createFileRoute, Outlet } from "@tanstack/react-router";
import { networkQueryOptions } from "@/features/facilitator/api";

// A layout: the dashboard lives at the index, and each followed organisation has
// its own CRM sheet underneath. Loading the network here serves both.
export const Route = createFileRoute("/_auth/facilitator/$networkSlug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(networkQueryOptions(params.networkSlug)),
  component: Outlet,
});
