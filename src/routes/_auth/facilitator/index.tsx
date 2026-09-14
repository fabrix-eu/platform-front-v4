import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/facilitator/")({
  component: () => <PagePlaceholder title="Facilitator dashboard" lede="Your network at a glance: tasks, team and organisations to follow up." />,
});
