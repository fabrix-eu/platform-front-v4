import { z } from "zod";
import { urlBoolean } from "@/lib/searchParams";
import { CITIES, ROTTERDAM_YEARS } from "./cities";

/**
 * The map's state lives in the URL, so a filtered view of a city is a link someone can
 * send. None of these names are used by another route: search param names are shared
 * across the whole router, and reusing one with different values breaks the routes that
 * already own it — `tab` and `view` are both taken.
 */
export const dataSearchSchema = z.object({
  city: z.enum(CITIES).optional(),
  /** Rotterdam only: the snapshot year. */
  year: z.coerce.number().refine((n) => (ROTTERDAM_YEARS as readonly number[]).includes(n)).optional(),
  /** Comma separated NACE category slugs. */
  cats: z.string().optional(),
  /** Aggregate into hexagonal cells rather than plotting every business. */
  hexbin: urlBoolean,
  /** Athens only: match a business on its secondary activity codes too. */
  secondary: urlBoolean,
});

export type DataSearch = z.infer<typeof dataSearchSchema>;
