import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { api, type Paginated } from "@/lib/api";

/**
 * What GET /admin/organizations returns — OrganizationBlueprint's *default* view.
 *
 * Not the extended one: workers and turnover are private and live there, and that
 * default view is also what the public endpoint serves. The server can sort on them
 * all the same, which is why the table only offers the columns it can actually show.
 */
export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  kind: string | null;
  address: string | null;
  country_code: string | null;
  image_url: string | null;
  claimed: boolean;
  relations_count: number;
  created_at: string;
}

type Params = Record<string, string | number | undefined>;

export const adminOrganizationsQueryOptions = (params: Params) =>
  queryOptions({
    queryKey: ["admin", "organizations", params],
    queryFn: () => api.get<Paginated<AdminOrganization>>("/admin/organizations", params),
    // Paging a worked-through list: the table should not blink back to a skeleton
    // between pages, it should stay legible while the next one arrives.
    placeholderData: keepPreviousData,
  });
