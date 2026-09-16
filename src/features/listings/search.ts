import { z } from "zod";

// Everything the marketplace shows is in the URL: a filtered view can be shared.
export const marketplaceSearchSchema = z.object({
  search: z.string().optional(),
  by_type: z.string().optional(),
  by_category: z.string().optional(),
  by_subcategory: z.string().optional(),
  country: z.string().optional(),
  /** "all" = the visitor cleared the default "near my organisation" filter. */
  near: z.literal("all").optional(),
  radius: z.number().optional(),
  view: z.enum(["cards", "list", "map"]).optional(),
});

export type MarketplaceSearch = z.infer<typeof marketplaceSearchSchema>;
