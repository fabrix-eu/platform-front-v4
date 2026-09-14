import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/$orgSlug/listings")({
  component: () => <PagePlaceholder title="Listings" lede="What your organisation offers and looks for." />,
});
