import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { City, Year } from "./cities";

export interface NaceCategory {
  id: string;
  name: string;
  slug: string;
  color_hex: string;
  nace_codes: string[];
}

interface CompanyBase {
  address: string;
  latitude: number;
  longitude: number;
  categories: NaceCategory[];
}

export interface RotterdamCompany extends CompanyBase {
  id: number;
  name: string;
  sbi_code: string;
  jobs: number;
  year: number;
}

export interface AthensCompany extends CompanyBase {
  id: string;
  business_name: string;
  status: string;
  primary_nace_code: string;
  secondary_nace_codes: string[];
}

export type Company = RotterdamCompany | AthensCompany;

/** Both cities describe a business the same way once its label is resolved. */
export const companyName = (company: Company): string =>
  "name" in company ? company.name : company.business_name;

/** These endpoints answer `{ data, meta }`, which the client leaves intact. */
interface CompaniesPayload<T> {
  data: T[];
  meta: { total_count: number; year?: number };
}

/**
 * Built by hand rather than passed to the client's `params`: it joins arrays with a
 * comma, and Rails' `parse_array_param` would read "a,b" as one slug that matches no
 * category — an empty map with no error anywhere. These endpoints want the key
 * repeated.
 */
function companiesPath(city: City, categories: string[], extra: Record<string, string> = {}): string {
  const sp = new URLSearchParams(extra);
  categories.forEach((slug) => sp.append("categories[]", slug));
  return `/data_imports/${city}_companies?${sp.toString()}`;
}

export const naceCategoriesQueryOptions = queryOptions({
  queryKey: ["data", "nace_categories"],
  queryFn: () => api.get<NaceCategory[]>("/data_imports/nace_categories"),
  // The vocabulary of a public register: it does not move while you browse.
  staleTime: 60 * 60 * 1000,
});

export const rotterdamCompaniesQueryOptions = (year: Year, categories: string[]) =>
  queryOptions({
    queryKey: ["data", "rotterdam", year, [...categories].sort()],
    queryFn: () => api.get<CompaniesPayload<RotterdamCompany>>(companiesPath("rotterdam", categories, { year: String(year) })),
    // Nothing to ask for until a category is picked, and the whole city is a lot to load.
    enabled: categories.length > 0,
  });

export const athensCompaniesQueryOptions = (categories: string[], includeSecondary: boolean) =>
  queryOptions({
    queryKey: ["data", "athens", [...categories].sort(), includeSecondary],
    queryFn: () =>
      api.get<CompaniesPayload<AthensCompany>>(
        companiesPath("athens", categories, includeSecondary ? { include_secondary_nace_codes: "true" } : {}),
      ),
    enabled: categories.length > 0,
  });
