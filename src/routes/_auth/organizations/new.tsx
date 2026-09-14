import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/organizations/new")({
  component: () => <PagePlaceholder title="Add an organisation" lede="Create your organisation's profile, or claim the one that already exists." />,
});
