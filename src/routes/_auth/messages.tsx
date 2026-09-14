import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/messages")({
  component: () => <PagePlaceholder title="Messages" lede="Your conversations with other members." />,
});
