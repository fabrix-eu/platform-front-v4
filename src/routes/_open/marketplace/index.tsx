import { createFileRoute } from "@tanstack/react-router";
import { MarketplacePage } from "@/features/listings/MarketplacePage";
import { marketplaceSearchSchema } from "@/features/listings/search";

export const Route = createFileRoute("/_open/marketplace/")({
  validateSearch: marketplaceSearchSchema,
  component: MarketplacePage,
});
