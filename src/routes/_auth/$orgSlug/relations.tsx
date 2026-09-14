import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/$orgSlug/relations")({
  component: () => <PagePlaceholder title="Connections" lede="The partners you work with — add them, and invite them to claim their profile." />,
});
