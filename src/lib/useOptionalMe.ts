import { useQuery } from "@tanstack/react-query";
import { tokens } from "./api";
import { meQueryOptions, type User } from "./auth";

/**
 * The current user on pages that visitors can see too (marketplace). Not a guard:
 * the token only decides whether asking /me is worth it; the answer is the truth.
 */
export function useOptionalMe(): User | undefined {
  return useQuery({ ...meQueryOptions, enabled: !!tokens.access() }).data;
}
