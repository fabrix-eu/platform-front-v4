import type { BadgeTone } from "@/components/ui/Badge";
import { SUBCATEGORY_LABELS } from "./subcategories";

// Listing#LISTING_TYPES / CATEGORIES_BY_TYPE on the API, with their labels.

export const LISTING_TYPES = ["material", "capacity", "service", "product", "distribution"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const LISTING_TYPE_META: Record<ListingType, { label: string; singular: string; tone: BadgeTone }> = {
  material: { label: "Materials", singular: "material", tone: "green" },
  capacity: { label: "Capacities", singular: "capacity", tone: "amber" },
  service: { label: "Services", singular: "service", tone: "teal" },
  product: { label: "Products", singular: "product", tone: "rose" },
  distribution: { label: "Distribution", singular: "distribution channel", tone: "indigo" },
};

export const CATEGORIES_BY_TYPE: Record<ListingType, string[]> = {
  material: ["waste_streams", "raw_materials", "intermediate_materials", "certified_materials"],
  capacity: ["equipment", "facilities", "open_spaces", "workforce", "financing_programs"],
  service: [
    "production_manufacturing",
    "sorting_processing",
    "design_development",
    "logistics_collection",
    "consulting_training",
    "certification_auditing",
    "end_of_life",
  ],
  product: ["apparel_accessories", "home_living", "technical_industrial", "upcycled_circular"],
  distribution: ["retail_resale", "wholesale", "ecommerce_platforms"],
};

const CATEGORY_LABELS: Record<string, string> = {
  waste_streams: "Waste streams",
  raw_materials: "Raw materials",
  intermediate_materials: "Intermediate materials",
  certified_materials: "Certified materials",
  equipment: "Equipment",
  facilities: "Facilities",
  open_spaces: "Open spaces",
  workforce: "Workforce",
  financing_programs: "Financing & programs",
  production_manufacturing: "Production & manufacturing",
  sorting_processing: "Sorting & processing",
  design_development: "Design & development",
  logistics_collection: "Logistics & collection",
  consulting_training: "Consulting & training",
  certification_auditing: "Certification & auditing",
  end_of_life: "End-of-life & second life",
  apparel_accessories: "Apparel & accessories",
  home_living: "Home & living",
  technical_industrial: "Technical & industrial",
  upcycled_circular: "Upcycled & circular",
  retail_resale: "Retail & resale",
  wholesale: "Wholesale",
  ecommerce_platforms: "E-commerce & platforms",
};

export const isListingType = (value: string | undefined): value is ListingType =>
  !!value && (LISTING_TYPES as readonly string[]).includes(value);

export const typeMeta = (type: string) =>
  isListingType(type) ? LISTING_TYPE_META[type] : { label: type, singular: "listing", tone: "slate" as const };

export const categoryLabel = (category: string) => CATEGORY_LABELS[category] ?? category;

export const subcategoryLabel = (category: string, subcategory: string) =>
  SUBCATEGORY_LABELS[category]?.[subcategory] ?? subcategory;

export const categoryOptions = (type: string) =>
  (isListingType(type) ? CATEGORIES_BY_TYPE[type] : []).map((value) => ({ value, label: categoryLabel(value) }));

export const subcategoryOptions = (category: string) =>
  Object.entries(SUBCATEGORY_LABELS[category] ?? {}).map(([value, label]) => ({ value, label }));
