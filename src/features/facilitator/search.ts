import { z } from "zod";

export const NETWORK_TABS = ["overview", "organisations", "tasks", "team"] as const;

export type NetworkTab = (typeof NETWORK_TABS)[number];

export const TAB_LABELS: Record<NetworkTab, string> = {
  overview: "Overview",
  organisations: "Organisations",
  tasks: "Tasks",
  team: "Team",
};

// The dashboard's view state, like the profile editor's: which tab is open, and
// what each tab is filtered by.
export const networkSearchSchema = z.object({
  tab: z.enum(NETWORK_TABS).optional(),
  /** Organisations tab: search on the followed organisation. */
  q: z.string().optional(),
  /** Tasks tab: to do or done. */
  tasks: z.enum(["open", "done"]).optional(),
});

export type NetworkSearch = z.infer<typeof networkSearchSchema>;
