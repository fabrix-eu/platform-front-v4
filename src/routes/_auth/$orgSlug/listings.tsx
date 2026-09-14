import { createFileRoute } from "@tanstack/react-router";
import { OrgListingsPage } from "@/features/listings/OrgListingsPage";

export const Route = createFileRoute("/_auth/$orgSlug/listings")({
  component: OrgListingsPage,
});
