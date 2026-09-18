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
});

export type AdminSearch = z.infer<typeof adminSearchSchema>;

/** The query the API wants, from the URL the person is looking at. */
export function adminListParams(search: AdminSearch): Record<string, string | number | undefined> {
  return {
    search: search.q || undefined,
    page: search.page,
    per_page: 30,
    sort_by: search.sort_by,
    sort_direction: search.sort_direction,
    kinds: search.kinds || undefined,
    by_claimed: search.status ? String(search.status === "claimed") : undefined,
    by_country: search.country || undefined,
  };
}
