import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/marketplace")({
  component: () => <PagePlaceholder title="Marketplace" lede="Materials, capacities, services and products — offered and wanted — across the network." />,
});
