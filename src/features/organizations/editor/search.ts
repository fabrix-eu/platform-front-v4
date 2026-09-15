import { z } from "zod";

// The editor's view state lives in the URL: which tab, which section is open.
export const EDITOR_TABS = ["edit", "team", "public"] as const;
export const EDITOR_SECTIONS = ["identity", "what-you-do", "size-reach", "offers-needs", "certifications", "photos", "assessment"] as const;

export type EditorSectionKey = (typeof EDITOR_SECTIONS)[number];

export const profileEditorSearchSchema = z.object({
  tab: z.enum(EDITOR_TABS).optional(),
  section: z.enum(EDITOR_SECTIONS).optional(),
});
