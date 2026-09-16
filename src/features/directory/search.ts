import { z } from "zod";

// Everything the directory shows is in the URL: a filtered view can be shared.
export const directorySearchSchema = z.object({
  search: z.string().optional(),
  /** Comma separated Organization#kind values. */
  kinds: z.string().optional(),
  country: z.string().optional(),
  /** "claimed" = someone manages it; "unclaimed" = it is waiting for its team. */
  status: z.enum(["claimed", "unclaimed"]).optional(),
  /** "all" = the visitor cleared the default "near my organisation" filter. */
  near: z.literal("all").optional(),
  radius: z.number().optional(),
  view: z.enum(["cards", "list", "map"]).optional(),
});

export type DirectorySearch = z.infer<typeof directorySearchSchema>;

export const kindList = (kinds?: string): string[] => (kinds ? kinds.split(",").filter(Boolean) : []);

/** Toggling one kind on or off, back into the comma separated param. */
export function toggleKind(kinds: string | undefined, kind: string): string | undefined {
  const current = kindList(kinds);
  const next = current.includes(kind) ? current.filter((k) => k !== kind) : [...current, kind];
  return next.length > 0 ? next.join(",") : undefined;
}
