import { z } from "zod";

/**
 * One schema for every admin list: they all search, sort and page the same way, and
 * search param names are shared across the whole router anyway — giving each list its
 * own would only invent collisions.
 *
 * `q`, `kinds`, `status` and `country` already exist elsewhere with these exact types;
 * only the sorting and paging names are new.
 */
export const adminSearchSchema = z.object({
  /** Free text, debounced into the URL. */
  q: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  /** Validated server-side against Organization::SORTABLE — a bad column falls back. */
  sort_by: z.string().optional(),
  sort_direction: z.enum(["asc", "desc"]).optional(),
  /** Organisations: comma separated Organization#kind values. */
  kinds: z.string().optional(),
  status: z.enum(["claimed", "unclaimed"]).optional(),
  country: z.string().optional(),
  /**
   * Claims have their own vocabulary. It cannot share `status`: that one already means
   * claimed/unclaimed here and in the directory, and a name means one thing across the
   * whole router or it means nothing.
   */
  claim_status: z.enum(["pending", "approved", "rejected", "cancelled"]).optional(),
  /** Feedbacks: bug, feature or question. */
  category: z.enum(["bug", "feature", "question"]).optional(),
});

export type AdminSearch = z.infer<typeof adminSearchSchema>;

type Params = Record<string, string | number | undefined>;

/** What every list sends: the text, the page, the order. */
const common = (search: AdminSearch): Params => ({
  search: search.q || undefined,
  page: search.page,
  per_page: 30,
  sort_by: search.sort_by,
  sort_direction: search.sort_direction,
});

export const adminOrganizationParams = (search: AdminSearch): Params => ({
  ...common(search),
  kinds: search.kinds || undefined,
  by_claimed: search.status ? String(search.status === "claimed") : undefined,
  by_country: search.country || undefined,
});

export const adminNetworkParams = (search: AdminSearch): Params => common(search);

export const adminClaimParams = (search: AdminSearch): Params => ({
  ...common(search),
  status: search.claim_status,
});

export const adminFeedbackParams = (search: AdminSearch): Params => ({
  ...common(search),
  category: search.category,
});
