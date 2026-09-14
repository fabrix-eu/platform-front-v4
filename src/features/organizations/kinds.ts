// Labels for Organization#kind, as the API returns it.
export const ORG_KIND_LABELS: Record<string, string> = {
  brand_retailer: "Brand / Retailer",
  producer: "Producer",
  facility_factory_supplier_vendor: "Facility / Supplier",
  collector_sorter: "Collector / Sorter",
  designer: "Designer",
  recycler: "Recycler",
  academic_researcher_journalist_student: "Academic / Research",
  auditor_certification_service_provider: "Auditor / Service",
  civil_society_organization: "Civil Society",
  multi_stakeholder_initiative: "Multi-stakeholder",
  union: "Union",
  other: "Other",
};

export const orgKindLabel = (kind: string | null | undefined) => (kind ? (ORG_KIND_LABELS[kind] ?? "Other") : "Other");
