import { z } from "zod";

export const NETWORK_TABS = ["overview", "organisations", "tasks", "team", "settings"] as const;

export type NetworkTab = (typeof NETWORK_TABS)[number];

export const TAB_LABELS: Record<NetworkTab, string> = {
  overview: "Overview",
  organisations: "Organisations",
  tasks: "Tasks",
  team: "Team",
  settings: "Settings",
};

/** The table is the default: this is a working list before it is a gallery. */
export const ORG_VIEWS = ["table", "cards", "map", "graph"] as const;
export type OrgView = (typeof ORG_VIEWS)[number];

// The dashboard's view state, like the profile editor's: which tab is open, and
// how each tab is filtered. A filtered list is a shareable URL.
export const networkSearchSchema = z.object({
  tab: z.enum(NETWORK_TABS).optional(),
  /** Organisations: free-text search on the followed organisation. */
  q: z.string().optional(),
  /**
   * Not `view`: search param names are shared across every route, and the
   * marketplace and the directory already own `view` with their own values.
   * Widening theirs would let `?view=table` into pages that cannot render it.
   */
  org_view: z.enum(ORG_VIEWS).optional(),
  /** Comma separated Organization#kind values. */
  kinds: z.string().optional(),
  /** Comma separated specialty keys. */
  specialties: z.string().optional(),
  /** One NetworkOrganization#economic_health value. */
  health: z.string().optional(),
  country: z.string().optional(),
  min_workers: z.number().optional(),
  max_workers: z.number().optional(),
  /** Tasks: to do or done. */
  tasks: z.enum(["open", "done"]).optional(),
});

export type NetworkSearch = z.infer<typeof networkSearchSchema>;

export { csvList, toggleCsv } from "@/lib/csv";

/** True when anything narrows the list — drives the "Clear" control. */
export const hasOrgFilters = (search: NetworkSearch): boolean =>
  !!(search.q || search.kinds || search.specialties || search.health || search.country || search.min_workers || search.max_workers);

/**
 * The API params behind the filters. `within_organization_workers` is a has_scope
 * hash, so its members travel in brackets — the same shape the directory uses for
 * `within_distance`.
 */
export function orgFilterParams(search: NetworkSearch): Record<string, string | number | undefined> {
  return {
    search: search.q || undefined,
    kinds: search.kinds || undefined,
    specialties: search.specialties || undefined,
    economic_health: search.health || undefined,
    country: search.country || undefined,
    "within_organization_workers[min_workers]": search.min_workers,
    "within_organization_workers[max_workers]": search.max_workers,
  };
}
