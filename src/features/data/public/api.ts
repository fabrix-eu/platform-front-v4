import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Count {
  key: string;
  count: number;
}

interface YearRows {
  year: number;
  rows: number;
}

/** GET /data/summary: how much each dataset holds, and the network in aggregates. */
export interface DataSummary {
  datasets: {
    rotterdam: { rows: number; years: YearRows[] };
    athens: { rows: number };
    netherlands_employment: { rows: number; years: YearRows[] };
    belgium_companies: { rows: number };
  };
  network: {
    organizations: number;
    organizations_geolocated: number;
    organizations_by_country: Count[];
    organizations_by_kind: Count[];
    relations: number;
    relations_by_type: Count[];
    listings: number;
    listings_by_type: Count[];
    events: number;
    assessments_completed: number;
    networks: number;
    network_organizations: number;
  };
  generated_at: string;
}

// Public, and cached an hour on the API side too: the figures move slowly.
export const dataSummaryQueryOptions = queryOptions({
  queryKey: ["data", "summary"],
  queryFn: () => api.get<DataSummary>("/data/summary"),
  staleTime: 60 * 60_000,
});

export interface DataRequestParams {
  name: string;
  email: string;
  organisation: string;
  dataset: string;
  purpose: string;
}

/** POST /data_requests: no account needed; the team answers by email. */
export function submitDataRequest(data_request: DataRequestParams): Promise<{ id: string }> {
  return api.post("/data_requests", { data_request });
}

export const formatCount = (n: number): string => n.toLocaleString("en-GB");
