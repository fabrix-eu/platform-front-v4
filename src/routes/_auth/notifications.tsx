import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/notifications")({
  component: () => <PagePlaceholder title="Notifications" lede="What happened on your organisations, listings and events." />,
});
