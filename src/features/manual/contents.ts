import { z } from "zod";

/**
 * The manual's table of contents. Only pages that are actually written are listed —
 * a chapter that opens on nothing is worse than a chapter that is not announced yet.
 */
export const MANUAL_PAGES = ["getting-started", "your-profile", "what-you-do"] as const;

export type ManualPage = (typeof MANUAL_PAGES)[number];

export const manualPageSchema = z.enum(MANUAL_PAGES);

export interface ManualEntry {
  page: ManualPage;
  label: string;
  /** One line, shown under the title and in the section index. */
  summary: string;
}

export interface ManualSection {
  title: string;
  entries: ManualEntry[];
}

export const MANUAL: ManualSection[] = [
  {
    title: "Start here",
    entries: [
      {
        page: "getting-started",
        label: "Getting started",
        summary: "Create your organisation, or claim the one already on FABRIX.",
      },
    ],
  },
  {
    title: "Your organisation",
    entries: [
      {
        page: "your-profile",
        label: "Your profile",
        summary: "What partners see, and which parts stay between you and the platform.",
      },
      {
        page: "what-you-do",
        label: "What you do",
        summary: "The vocabulary of the value chain: activities, categories and specialities.",
      },
    ],
  },
];

const ALL = MANUAL.flatMap((section) => section.entries);

export const entryFor = (page: ManualPage): ManualEntry => ALL.find((entry) => entry.page === page) ?? ALL[0];

export const sectionOf = (page: ManualPage): string =>
  MANUAL.find((section) => section.entries.some((entry) => entry.page === page))?.title ?? "";

/** Previous and next, so the manual can be read straight through. */
export function neighbours(page: ManualPage): { previous?: ManualEntry; next?: ManualEntry } {
  const index = ALL.findIndex((entry) => entry.page === page);
  return { previous: ALL[index - 1], next: ALL[index + 1] };
}
