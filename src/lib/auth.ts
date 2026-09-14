import { queryOptions } from "@tanstack/react-query";
import { api, tokens } from "./api";
import { queryClient } from "./queryClient";

export interface MeOrganization {
  organization_id: string;
  organization_name: string;
  organization_slug: string;
  organization_kind: string;
  organization_image_url: string | null;
  organization_address: string | null;
  organization_country_code: string | null;
  organization_lon: number | null;
  organization_lat: number | null;
  organization_registration_step: number;
  onboarding_complete: boolean;
  role: "owner" | "admin" | "member";
  relations_count: number;
  assessments_completed: number;
  assessments_total: number;
}

export interface UserNetwork {
  id: string;
  name: string;
  slug: string;
  role: string;
  center_lon: number | null;
  center_lat: number | null;
  radius_km: number | null;
  organization: { id: string; name: string; lon: number | null; lat: number | null } | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "facilitator" | "admin";
  image_url: string | null;
  organizations: MeOrganization[];
  networks: UserNetwork[];
}

export function getMe(): Promise<User> {
  return api.get<User>("/me");
}

// The current user is server state. Routes guard on this query, never on token presence.
export const meQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: getMe,
  staleTime: 5 * 60_000,
  retry: false,
});

export const isAdmin = (user: User) => user.role === "admin";

export const isFacilitator = (user: User) =>
  user.networks.length > 0 || user.role === "facilitator" || user.role === "admin";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

// The API returns tokens only, so the user is fetched right after.
export async function login(email: string, password: string): Promise<User> {
  const data = await api.post<LoginResponse>("/auth_tokens", { email, password });
  tokens.set(data.access_token, data.refresh_token);
  return queryClient.fetchQuery(meQueryOptions);
}

export async function logout(): Promise<void> {
  try {
    await api.delete("/auth_tokens", { refresh_token: tokens.refresh() });
  } finally {
    tokens.clear();
    queryClient.removeQueries({ queryKey: ["me"] });
  }
}
