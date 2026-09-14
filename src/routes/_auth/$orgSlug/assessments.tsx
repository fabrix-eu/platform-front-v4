import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/$orgSlug/assessments")({
  component: () => <PagePlaceholder title="Compass" lede="Measure and improve your circularity practices." />,
});
