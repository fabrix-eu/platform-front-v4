import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isFacilitator, meQueryOptions } from "@/lib/auth";

export const Route = createFileRoute("/_auth/facilitator")({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions);
    if (!isFacilitator(me)) throw redirect({ to: "/" });
  },
  component: Outlet,
});
