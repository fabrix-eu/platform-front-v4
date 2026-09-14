import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/$orgSlug/messages")({
  component: () => <PagePlaceholder title="Messages" lede="Conversations on behalf of your organisation." />,
});
