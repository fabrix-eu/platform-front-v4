import { z } from "zod";
import { explanation } from "./sections/explanation";
import { howTo } from "./sections/howTo";
import { reference } from "./sections/reference";
import { tutorials } from "./sections/tutorials";

/**
 * The manual's table of contents, laid out the Diátaxis way: four sections that
 * each answer one kind of need — learn, do, look up, understand. Every page is
 * announced here; the ones not written yet open on their summary and say so.
 */
export const MANUAL_PAGES = [
  // Start here (tutorials)
  "getting-started",
  "your-first-listing",
  "bring-your-partners",
  // How-to guides
  "create-an-account",
  "reset-your-password",
  "manage-notifications",
  "delete-your-account",
  "claim-your-organisation",
  "complete-your-profile",
  "manage-your-team",
  "join-an-organisation",
  "publish-a-listing",
  "manage-your-listings",
  "search-the-marketplace",
  "add-an-event",
  "attend-an-event",
  "find-organisations",
  "add-a-partner",
  "send-a-message",
  "complete-the-compass",
  "run-your-network",
  "follow-an-organisation",
  "send-feedback",
  // Reference
  "your-profile",
  "what-you-do",
  "roles-and-permissions",
  "listing-fields",
  "relation-types",
  "notification-types",
  "compass-questionnaires",
  "network-records",
  "data-sources",
  // Understanding FABRIX (explanation)
  "how-the-network-grows",
  "people-and-organisations",
  "claimed-and-unclaimed",
  "what-is-visible",
  "facilitators-and-networks",
  "the-impact-compass",
] as const;

export type ManualPage = (typeof MANUAL_PAGES)[number];

export const manualPageSchema = z.enum(MANUAL_PAGES);

export interface ManualEntry {
  page: ManualPage;
  label: string;
  /** One line, shown under the title and in the section index. */
  summary: string;
  /** Sub-heading in the contents, for the long sections ("Marketplace", "Events"…). */
  area?: string;
}

export interface ManualSection {
  title: string;
  /** The Diátaxis kind, spelled for the reader: what this section is for. */
  purpose: string;
  entries: ManualEntry[];
}

export const MANUAL: ManualSection[] = [tutorials, howTo, reference, explanation];

const ALL = MANUAL.flatMap((section) => section.entries);

export const entryFor = (page: ManualPage): ManualEntry => ALL.find((entry) => entry.page === page) ?? ALL[0];

export const sectionOf = (page: ManualPage): string =>
  MANUAL.find((section) => section.entries.some((entry) => entry.page === page))?.title ?? "";

/** Previous and next, so the manual can be read straight through. */
export function neighbours(page: ManualPage): { previous?: ManualEntry; next?: ManualEntry } {
  const index = ALL.findIndex((entry) => entry.page === page);
  return { previous: ALL[index - 1], next: ALL[index + 1] };
}
