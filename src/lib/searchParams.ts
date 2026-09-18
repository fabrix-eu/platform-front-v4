import { z } from "zod";

/**
 * A boolean that survives the round trip through a URL. The router hands back a real
 * boolean for the links the app builds itself, but a link someone typed or was sent
 * carries the string — and being sendable is the whole reason this state lives in the
 * URL at all.
 */
export const urlBoolean = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true")
  .optional();
