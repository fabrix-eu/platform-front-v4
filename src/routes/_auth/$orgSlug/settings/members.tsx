import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/$orgSlug/settings/members")({
  component: () => <PagePlaceholder title="Members" lede="Your team, and the partners you invite to join." />,
});
