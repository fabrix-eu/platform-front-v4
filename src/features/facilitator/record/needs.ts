/** What one need holds: whether it applies, and the facilitator's note about it. */
export type Needs = Record<string, { selected?: boolean; note?: string }>;

/**
 * The facilitator's needs assessment. The keys match the jsonb already in
 * production — do not rename them, the stored data is keyed on these.
 */
export const NEED_OPTIONS: { key: string; label: string; description: string }[] = [
  { key: "financial_support", label: "Financial support", description: "Access to funding, grants or investment" },
  { key: "technical_expertise", label: "Technical expertise", description: "Specialised knowledge in production, processes or technology" },
  { key: "market_access", label: "Market access", description: "Help entering new markets or reaching new customers" },
  { key: "supply_chain_optimization", label: "Supply chain optimisation", description: "Efficiency and sustainability along the supply chain" },
  { key: "regulatory_compliance", label: "Regulatory compliance", description: "Understanding and meeting regulatory requirements" },
  { key: "sustainability_consulting", label: "Sustainability consulting", description: "Guidance on environmental and social practices" },
  { key: "digital_transformation", label: "Digital transformation", description: "Modernising digital processes and systems" },
  { key: "talent_acquisition", label: "Talent acquisition", description: "Finding and hiring skilled workers" },
  { key: "partnership_opportunities", label: "Partnership opportunities", description: "Connecting with potential business partners" },
  { key: "innovation_support", label: "Innovation support", description: "R&D support and access to innovation networks" },
];

export const asNeeds = (value: unknown): Needs => (value && typeof value === "object" ? (value as Needs) : {});
