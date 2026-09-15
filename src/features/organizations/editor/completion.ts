import type { OrganizationProfile } from "../types";
import type { EditorSectionKey } from "./search";

export interface Essential {
  key: string;
  label: string;
  done: boolean;
}

/** The six essentials the ring counts — nothing else counts for or against it. */
export function essentials(org: OrganizationProfile): Essential[] {
  return [
    { key: "name", label: "Name", done: !!org.name?.trim() },
    { key: "address", label: "Address", done: !!org.address && org.lat != null && org.lon != null },
    { key: "contact", label: "A way to contact you", done: !!(org.email || org.phone || org.website) },
    // The API has no value-chain role yet: the organisation type stands in for it.
    { key: "role", label: "Your part in the making process", done: !!org.kind },
    { key: "sector", label: "One sector", done: !!org.sector },
    { key: "size", label: "How many people work here", done: org.number_of_workers != null },
  ];
}

export type SectionStatus = "complete" | "partial" | "not_started" | "private";
export type SectionGroup = "required" | "portrait" | "optional";

export interface EditorSection {
  key: EditorSectionKey;
  letter?: string;
  title: string;
  description: string;
  group: SectionGroup;
  status: SectionStatus;
}

const statusOf = (checks: boolean[]): SectionStatus =>
  checks.every(Boolean) ? "complete" : checks.some(Boolean) ? "partial" : "not_started";

export function editorSections(org: OrganizationProfile): EditorSection[] {
  const done = Object.fromEntries(essentials(org).map((e) => [e.key, e.done]));
  const hasListings = ["services", "materials", "capacities", "products"].some((k) => org.profile_completion?.sections[k]);

  return [
    {
      key: "identity",
      letter: "A",
      title: "Identity",
      group: "required",
      status: statusOf([done.name, done.address, done.contact]),
      description: "What people see first in the Directory and in search. Without it you are an unnamed pin no one can reach.",
    },
    {
      key: "what-you-do",
      letter: "B",
      title: "What you do",
      group: "required",
      status: statusOf([done.role, done.sector, org.specialties.length > 0]),
      description:
        "How the platform knows who to put in front of you — matchmaking, and which searches you show up in. The single biggest driver of relevant matches.",
    },
    {
      key: "size-reach",
      letter: "C",
      title: "Size & reach",
      group: "required",
      status: statusOf([done.size]),
      description: "This section helps to refine the search functions. It also supports with statistical knowledge for economic support. Exact numbers stay private.",
    },
    {
      key: "offers-needs",
      letter: "D",
      title: "Offers & needs",
      group: "portrait",
      status: hasListings ? "partial" : "not_started",
      description: "Puts what you offer and what you are looking for in front of the network and the Marketplace. This is the part that brings work to you.",
    },
    {
      key: "certifications",
      letter: "E",
      title: "Certifications",
      group: "portrait",
      status: "not_started",
      description: 'Proof points people filter on. Add the ones you hold and you appear when someone needs exactly your credentials — "None" is a perfectly good answer.',
    },
    {
      key: "photos",
      title: "Photos & media",
      group: "portrait",
      status: org.organization_photos.length > 0 ? "complete" : "not_started",
      description: "The first thing people look at. One good photo of the workshop does more than a paragraph — the cheapest way to look real.",
    },
    {
      key: "assessment",
      letter: "F",
      title: "Assessment",
      group: "optional",
      status: "private",
      description:
        'A private check on how you compare with similar organisations, and where the gaps are. Only "completed" ever shows publicly — your answers and results stay yours. Not needed to complete your profile.',
    },
  ];
}
