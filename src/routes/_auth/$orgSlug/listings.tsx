import { createFileRoute, redirect } from "@tanstack/react-router";

// Listings moved into the profile editor, as its "Offers & needs" section.
export const Route = createFileRoute("/_auth/$orgSlug/listings")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/$orgSlug/profile", params: { orgSlug: params.orgSlug }, search: { tab: "edit", section: "offers-needs" } });
  },
});
