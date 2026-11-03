import type { SelectOption } from "@/components/SelectField";

// The profile editor's vocabulary — the keys are Organization's (OrganizationProfile on
// the API), the labels the prototype's.

// "What kind of organisation are you?", stored in legal_form.
export const LEGAL_FORMS: SelectOption[] = [
  { value: "company", label: "Company" },
  { value: "sole_trader", label: "Sole trader" },
  { value: "partnership", label: "Partnership" },
  { value: "non_profit", label: "Non-profit / association" },
  { value: "cooperative", label: "Cooperative" },
  { value: "university_research", label: "University / research body" },
  { value: "public_body", label: "Public body" },
  { value: "other", label: "Other" },
];

// legal_form is free text on the API: a value imported earlier (e.g. "sarl") stays selectable.
export function legalFormOptions(current: string | null | undefined): SelectOption[] {
  return current && !LEGAL_FORMS.some((o) => o.value === current) ? [...LEGAL_FORMS, { value: current, label: current }] : LEGAL_FORMS;
}

export const SITE_RELATIONS: SelectOption[] = [
  { value: "whole_organisation", label: "No — this is the whole organisation" },
  { value: "branch", label: "Branch" },
  { value: "subsidiary", label: "Subsidiary" },
  { value: "franchise", label: "Franchise" },
  { value: "campus", label: "Campus" },
];

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

export const SECTORS: SelectOption[] = [
  { value: "textile_clothing", label: "Textile & clothing" },
  { value: "footwear_leather", label: "Footwear & leather" },
  { value: "home_textiles_furniture", label: "Home textiles & furniture" },
  { value: "technical_textiles", label: "Technical textiles" },
  { value: "fashion_retail", label: "Fashion retail" },
  { value: "waste_recycling", label: "Waste & recycling" },
  { value: "logistics", label: "Logistics" },
  { value: "education_research", label: "Education & research" },
  { value: "public_sector", label: "Public sector" },
  { value: "finance_business", label: "Finance & business services" },
  { value: "digital", label: "Digital" },
  { value: "other", label: "Other / not listed" },
];

// Suggestions only: a material not listed is kept as typed.
export const MATERIAL_SUGGESTIONS = [
  "Cotton",
  "Organic cotton",
  "Recycled cotton",
  "Denim",
  "Linen",
  "Hemp",
  "Wool",
  "Silk",
  "Polyester",
  "Recycled polyester",
  "Polyamide / nylon",
  "Viscose",
  "Lyocell",
  "Leather",
  "Workwear",
  "Yarn",
  "Fabric rolls",
  "Garments",
  "Post-consumer textiles",
  "Pre-consumer offcuts",
];

// Known certifications travel as keys; any other one is kept as typed.
export const CERTIFICATIONS: SelectOption[] = [
  { value: "gots", label: "GOTS" },
  { value: "oeko_tex", label: "OEKO-TEX" },
  { value: "iso_9001", label: "ISO 9001" },
  { value: "iso_14001", label: "ISO 14001" },
  { value: "b_corp", label: "B-Corp" },
  { value: "none", label: "None" },
];

export const TURNOVER_OPTIONS: SelectOption[] = [
  { value: "under_500k", label: "under €500k" },
  { value: "500k_2m", label: "€500k–2M" },
  { value: "2m_10m", label: "€2M–10M" },
  { value: "10m_50m", label: "€10M–50M" },
  { value: "50m_200m", label: "€50M–200M" },
  { value: "over_200m", label: "over €200M" },
];

// development_stage values the old editor wrote, and that production holds.
export const DEVELOPMENT_STAGES: SelectOption[] = [
  { value: "startup", label: "1–5 years (start-up)" },
  { value: "growth", label: "2–10 years (growth)" },
  { value: "maturing", label: "5–20 years (maturing)" },
  { value: "expansion", label: "10 years + (expansion or renewal)" },
  { value: "succession", label: "Succession or exit" },
];

export const REACHES = [
  { name: "reach_nearby_pct", label: "Nearby", hint: "up to 150 km" },
  { name: "reach_region_pct", label: "Wider region", hint: "150–500 km" },
  { name: "reach_continent_pct", label: "Continent", hint: "500–3,000 km" },
  { name: "reach_world_pct", label: "World", hint: "beyond 3,000 km" },
] as const;

/** The size band a headcount belongs to (EU size classes). */
export function sizeBand(people: number): string {
  if (people < 10) return "1–9 people";
  if (people < 50) return "10–49 people";
  if (people < 250) return "50–249 people";
  return "250+ people";
}
