import { z } from "zod";
import { urlBoolean } from "@/lib/searchParams";
import { DIRECTIONS } from "./directions";

// Everything the marketplace shows is in the URL: a filtered view can be shared.
export const marketplaceSearchSchema = z.object({
  search: z.string().optional(),
  /** Offered or wanted. */
  direction: z.enum(DIRECTIONS).optional(),
  /** A single occasion, or explicitly not one — both are worth filtering on. */
  one_off: urlBoolean,
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
