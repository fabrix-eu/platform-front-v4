import { z } from "zod";

// The catalog's own interactive state lives in the URL, like every page's view state:
// clicking a pill, a tab or a nav entry on /design is the real pattern, not a mock.
export const KINDS = ["everyone", "organisations", "facilitators", "researchers"] as const;
export const TABS = ["overview", "listings", "connections", "members"] as const;
export const NAV = ["home", "marketplace", "compass", "notifications"] as const;

export const designSearchSchema = z.object({
  kind: z.enum(KINDS).optional(),
  /** The MultiSelectMenu demo, comma separated like every multi-value filter. */
  activities: z.string().optional(),
  tab: z.enum(TABS).optional(),
  nav: z.enum(NAV).optional(),
});

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
