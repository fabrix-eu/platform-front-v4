import type { BadgeTone } from "@/components/ui/Badge";

/**
 * Which way round a listing runs, and whether it is a single occasion. Both were in
 * the product's language long before they were in its data: the marketplace lede
 * promised "offered and wanted", and the /design catalogue reserved the one solid
 * orange badge for exactly this.
 */
export const DIRECTIONS = ["offering", "needing"] as const;

export type Direction = (typeof DIRECTIONS)[number];

export const DIRECTION_META: Record<Direction, { label: string; badge: string; filter: string; tone: BadgeTone }> = {
  // First person on the form, because that is where you are saying it about yourself.
  offering: { label: "I'm offering this", badge: "Offering", filter: "Offered", tone: "green" },
  needing: { label: "I need this", badge: "Wanted", filter: "Wanted", tone: "orange" },
};

export const isDirection = (value: string | undefined): value is Direction =>
  !!value && (DIRECTIONS as readonly string[]).includes(value);

export const directionMeta = (value: string) =>
  isDirection(value) ? DIRECTION_META[value] : DIRECTION_META.offering;

export const ONE_OFF = {
  label: "This is a one-off",
  hint: "A single occasion rather than something you can supply or need again.",
  badge: "One-off",
} as const;
