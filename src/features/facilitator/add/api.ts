import { api } from "@/lib/api";
import type { OrganizationDraft } from "@/features/organizations/types";
import type { NetworkOrganization } from "../types";

/** One already on FABRIX, or a new one created unclaimed. An owner email invites them to claim it. */
export type AddOrganisationPayload =
  | { organization_id: string; owner_email?: string }
  | { organization: OrganizationDraft; owner_email?: string };

export interface Added {
  record: NetworkOrganization;
  /** The invitation could not go out (already claimed, already invited): the organisation is followed anyway. */
  warning?: string;
}

// The API answers { data } alone, or { data, warning } — which the client hands back whole.
type Created = NetworkOrganization | { data: NetworkOrganization; warning: string };

/** POST /networks/:slug/organizations */
export async function addNetworkOrganization(slug: string, payload: AddOrganisationPayload): Promise<Added> {
  const created = await api.post<Created>(`/networks/${slug}/organizations`, payload);
  return "warning" in created ? { record: created.data, warning: created.warning } : { record: created };
}
