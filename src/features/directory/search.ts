import { z } from "zod";

// Everything the directory shows is in the URL: a filtered view can be shared.
export const directorySearchSchema = z.object({
  search: z.string().optional(),
  /** Comma separated value chain stages — where an organisation sits. */
  stages: z.string().optional(),
  /** Comma separated support roles — how it supports the chain. */
  support: z.string().optional(),
  /** Comma separated listing types — what it offers on the marketplace right now. */
  offering: z.string().optional(),
  country: z.string().optional(),
  /** "claimed" = someone manages it; "unclaimed" = it is waiting for its team. */
  status: z.enum(["claimed", "unclaimed"]).optional(),
  /** Set = only what is within that many km of my organisation. Unset = everything, nearest first. */
  radius: z.number().optional(),
  view: z.enum(["cards", "list", "map"]).optional(),
});

export type DirectorySearch = z.infer<typeof directorySearchSchema>;
