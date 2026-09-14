import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/$orgSlug/dashboard")({
  component: () => <PagePlaceholder title="Home" lede="What is happening around your organisation." />,
});
