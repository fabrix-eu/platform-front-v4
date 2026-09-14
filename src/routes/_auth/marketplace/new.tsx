import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { NewListingPage } from "@/features/listings/form/NewListingPage";

export const Route = createFileRoute("/_auth/marketplace/new")({
  // ?type=material pre-selects the type (links from an empty category, a profile section…).
  validateSearch: z.object({ type: z.string().optional() }),
  component: NewListingPage,
});
