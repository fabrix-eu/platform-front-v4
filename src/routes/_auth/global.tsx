import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/global")({
  component: () => <PagePlaceholder title="Directory" lede="Every organisation on FABRIX, on a map and in a list." />,
});
