import { createFileRoute } from "@tanstack/react-router";
import { DesignPage } from "@/features/design/DesignPage";
import { designSearchSchema } from "@/features/design/search";

// Public on purpose: the catalog is shared with designers and partners.
export const Route = createFileRoute("/design")({
  validateSearch: designSearchSchema,
  component: DesignPage,
});
