import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DirectoryMapPage, DirectoryPage } from "./types";

/** Query params of GET /organizations (has_scope names; `kinds` is comma separated). */
export type DirectoryFilters = Record<string, string | number | boolean | undefined>;

export const DIRECTORY_KEY = ["directory"];

export const directoryInfiniteQueryOptions = (filters: DirectoryFilters) =>
  infiniteQueryOptions({
    queryKey: ["directory", "list", filters],
    queryFn: ({ pageParam }) => api.get<DirectoryPage>("/organizations", { ...filters, page: pageParam, per_page: 30 }),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.next_page ?? undefined,
  });

/** The map needs them all at once: `view=map` skips pagination (2000 max). */
export const directoryMapQueryOptions = (filters: DirectoryFilters) =>
  queryOptions({
    queryKey: ["directory", "map", filters],
    queryFn: () => api.get<DirectoryMapPage>("/organizations", { ...filters, view: "map" }),
  });
