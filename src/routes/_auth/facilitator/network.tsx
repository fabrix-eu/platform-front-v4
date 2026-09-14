import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/facilitator/network")({
  component: () => <PagePlaceholder title="My network" lede="The organisations you follow, their needs and your notes." />,
});
