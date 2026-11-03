import type { SelectOption } from "@/components/SelectField";

// Where an organisation sits: the stages of the value chain it works in, and the
// ways it supports the chain (OrganizationProfile on the API). It is what the
// directory filters on and what a badge shows — the organisation's kind is no
// longer shown anywhere.

export const VALUE_CHAIN_STAGES: SelectOption[] = [
  { value: "raw_materials", label: "01 Raw materials" },
  { value: "materials_processing", label: "02 Materials processing" },
  { value: "making_assembly", label: "03 Making & assembly" },
  { value: "distribution", label: "04 Distribution" },
  { value: "retail", label: "05 Retail" },
  { value: "use_upkeep", label: "06 Use & upkeep" },
  { value: "collection_recovery", label: "07 Collection & recovery" },
];

export const SUPPORT_ROLES: SelectOption[] = [
  { value: "logistics_transport", label: "Logistics & transport" },
  { value: "machinery_equipment", label: "Machinery & equipment" },
  { value: "design_creative", label: "Design & creative" },
  { value: "technical_consulting", label: "Technical & consulting" },
  { value: "research_education", label: "Research & education" },
  { value: "finance_business", label: "Finance & business services" },
  { value: "it_digital", label: "IT & digital" },
  { value: "other", label: "Other / not listed" },
];

/** Any payload carrying an organisation's position (all optional: not every payload has it). */
export interface Positioned {
  value_chain_stages?: string[] | null;
  support_roles?: string[] | null;
  support_roles_other?: string | null;
}

const STAGE_NAMES = Object.fromEntries(VALUE_CHAIN_STAGES.map((o) => [o.value, o.label.replace(/^\d+ /, "")]));
const ROLE_NAMES = Object.fromEntries(SUPPORT_ROLES.map((o) => [o.value, o.label]));

export const stageName = (stage: string) => STAGE_NAMES[stage] ?? stage;

export const roleName = (role: string, other?: string | null) => (role === "other" ? other || "Other support" : (ROLE_NAMES[role] ?? role));

/** Every stage, then every support role, by name — a profile's full position. */
export function positionNames(org: Positioned): string[] {
  return [...(org.value_chain_stages ?? []).map(stageName), ...(org.support_roles ?? []).map((r) => roleName(r, org.support_roles_other))];
}

/** The badge: the first stage, else the first support role (the prototype's `stage || role`). */
export const positionLabel = (org: Positioned): string | null => positionNames(org)[0] ?? null;
