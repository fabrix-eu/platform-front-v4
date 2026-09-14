import { createFileRoute } from "@tanstack/react-router";
import { NewOrganizationPage } from "@/features/organizations/new/NewOrganizationPage";

export const Route = createFileRoute("/_auth/organizations/new")({
  component: NewOrganizationPage,
});
