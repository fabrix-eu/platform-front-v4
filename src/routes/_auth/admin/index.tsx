import { createFileRoute, redirect } from "@tanstack/react-router";

// /admin on its own opens the first list rather than an index of links the tabs
// already show.
export const Route = createFileRoute("/_auth/admin/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/organizations" });
  },
});
