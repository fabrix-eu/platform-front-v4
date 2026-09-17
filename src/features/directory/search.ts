import { z } from "zod";

// Everything the directory shows is in the URL: a filtered view can be shared.
export const directorySearchSchema = z.object({
  search: z.string().optional(),
  /** Comma separated Organization#kind values — what an organisation *is*. */
  kinds: z.string().optional(),
  /** Comma separated listing types — what an organisation *does*, in value-chain terms. */
  activities: z.string().optional(),
  country: z.string().optional(),
  /** "claimed" = someone manages it; "unclaimed" = it is waiting for its team. */
  status: z.enum(["claimed", "unclaimed"]).optional(),
  /** "all" = the visitor cleared the default "near my organisation" filter. */
  near: z.literal("all").optional(),
  radius: z.number().optional(),
  view: z.enum(["cards", "list", "map"]).optional(),
});

export type DirectorySearch = z.infer<typeof directorySearchSchema>;
