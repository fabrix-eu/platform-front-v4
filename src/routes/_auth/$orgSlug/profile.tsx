import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/$orgSlug/profile")({
  component: () => <PagePlaceholder title="Profile" lede="How your organisation appears in the directory." />,
});
