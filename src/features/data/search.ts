import { z } from "zod";
import { CITIES, ROTTERDAM_YEARS } from "./cities";

/**
 * A boolean that survives the round trip through a URL. The router hands back a real
 * boolean for the links the app builds itself, but a link someone typed or was sent
 * carries the string — and being sendable is the whole reason this state lives here.
 */
const urlBoolean = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true")
  .optional();

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
