import { api } from "@/lib/api";
import type { OrganizationRelation } from "./types";

// Relation::RELATION_TYPES on the API, with how members understand them.
export const RELATION_TYPES = [
  { value: "input_output", label: "Supplier / customer", description: "Materials, goods or components go from one to the other." },
  { value: "services", label: "Service provider / client", description: "Logistics, repair, design, consulting or another service." },
  { value: "rnd", label: "R&D", description: "Joint research or co-development of circular solutions." },
  { value: "energetic", label: "Industrial symbiosis", description: "Shared flows — waste heat, energy, water, by-products." },
  { value: "membership", label: "Membership", description: "Part of the same network, incubator or accelerator." },
  { value: "shareholder", label: "Shareholder", description: "One has a financial stake in the other." },
] as const;

export const relationLabel = (type: string) => RELATION_TYPES.find((t) => t.value === type)?.label ?? type;

export interface NewRelation {
  from_organization_id: string;
  to_organization_id: string;
  relation_type: string;
  description?: string;
}

/** POST /relations — a member of either organisation may declare it. */
export function createRelation(relation: NewRelation) {
  return api.post<OrganizationRelation>("/relations", { relation });
}

/** DELETE /relations/:id — a member of either organisation may remove it. */
export function deleteRelation(id: string) {
  return api.delete<OrganizationRelation>(`/relations/${id}`);
}
