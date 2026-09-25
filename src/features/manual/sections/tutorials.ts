import type { ManualSection } from "../contents";

// Learning-oriented: a newcomer follows them in order and ends up with something real.
export const tutorials: ManualSection = {
  title: "Start here",
  purpose: "Learn by doing. Three guided walks, in order, from an empty account to a profile that works for you.",
  entries: [
    {
      page: "getting-started",
      label: "Getting started",
      summary: "Create your organisation, or claim the one already on FABRIX.",
    },
    {
      page: "your-first-listing",
      label: "Your first listing",
      summary: "Publish an offer or a need in a few minutes, and see where it shows up.",
    },
    {
      page: "bring-your-partners",
      label: "Bring your partners",
      summary: "Add the organisations you already work with, and invite them to claim their profile.",
    },
  ],
};
