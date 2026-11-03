import type { BadgeTone } from "@/components/ui/Badge";

// Listing#CATEGORIES_BY_TYPE on the API — the prototype's marketplace taxonomy,
// in two levels. Every type ends with "other", and the "other" type has no other
// category: either asks the poster to say what it is (`category_other`).

export const LISTING_TYPES = ["materials", "capacities", "services", "products", "logistics", "other"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const LISTING_TYPE_META: Record<ListingType, { label: string; singular: string; tone: BadgeTone }> = {
  materials: { label: "Equipment, goods & materials", singular: "listing", tone: "amber" },
  capacities: { label: "Capacities", singular: "capacity", tone: "violet" },
  services: { label: "Services", singular: "service", tone: "teal" },
  products: { label: "Products", singular: "product", tone: "rose" },
  logistics: { label: "Logistics & storage", singular: "logistics offer", tone: "slate" },
  other: { label: "Something else", singular: "listing", tone: "slate" },
};

export const CATEGORIES_BY_TYPE: Record<ListingType, string[]> = {
  materials: ["fibres_yarn", "fabrics_textiles", "offcuts_deadstock", "trims_components", "recycled_feedstock", "other"],
  capacities: ["machine_time", "production_space", "lab_testing", "storage_space", "specialised_tools", "other"],
  services: ["research_design", "production_manufacturing", "repair_alteration", "consulting_technical", "content_media_sales", "other"],
  products: ["apparel_accessories", "home_interior", "bags_leather", "footwear", "components_parts", "other"],
  logistics: ["local_delivery", "freight_haulage", "warehousing_storage", "reverse_logistics", "export_customs", "other"],
  other: ["other"],
};

const CATEGORY_LABELS: Record<string, string> = {
  fibres_yarn: "Fibres & yarn",
  fabrics_textiles: "Fabrics & textiles",
  offcuts_deadstock: "Offcuts, roll-ends & deadstock",
  trims_components: "Trims & components",
  recycled_feedstock: "Recycled feedstock",
  machine_time: "Machine time",
  production_space: "Production space",
  lab_testing: "Lab & testing",
  storage_space: "Storage space",
  specialised_tools: "Specialised tools",
  research_design: "Research & design",
  production_manufacturing: "Production & manufacturing",
  repair_alteration: "Repair & alteration",
  consulting_technical: "Consulting & technical services",
  content_media_sales: "Content, media & sales",
  apparel_accessories: "Apparel & accessories",
  home_interior: "Home & interior",
  bags_leather: "Bags & leather",
  footwear: "Footwear",
  components_parts: "Components & parts",
  local_delivery: "Local delivery & last mile",
  freight_haulage: "Freight & haulage",
  warehousing_storage: "Warehousing & storage",
  reverse_logistics: "Reverse logistics & take-back",
  export_customs: "Export & customs",
  other: "Something else",
};

export const isListingType = (value: string | undefined): value is ListingType =>
  !!value && (LISTING_TYPES as readonly string[]).includes(value);

export const typeMeta = (type: string) =>
  isListingType(type) ? LISTING_TYPE_META[type] : { label: type, singular: "listing", tone: "slate" as const };

export const categoryLabel = (category: string) => CATEGORY_LABELS[category] ?? category;

/** What a listing is filed under: its category, or what its poster said when it is "something else". */
export const listingCategoryLabel = (listing: { category: string; category_other: string | null }) =>
  (listing.category === "other" && listing.category_other) || categoryLabel(listing.category);

export const categoryOptions = (type: string) =>
  (isListingType(type) ? CATEGORIES_BY_TYPE[type] : []).map((value) => ({ value, label: categoryLabel(value) }));
