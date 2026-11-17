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
  country: z.string().optional(),
  /** Set = only what is within that many km of my organisation. Unset = everything, nearest first. */
  radius: z.number().optional(),
  view: z.enum(["cards", "list", "map"]).optional(),
});

export type MarketplaceSearch = z.infer<typeof marketplaceSearchSchema>;
