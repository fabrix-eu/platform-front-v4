import type { ManualSection } from "../contents";

// Information-oriented: the facts as the product has them, to be looked up, not read through.
export const reference: ManualSection = {
  title: "Reference",
  purpose: "Look something up. The fields, types, statuses and rules, exactly as the platform has them.",
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
    {
      page: "roles-and-permissions",
      label: "Roles and permissions",
      summary: "Who can do what: visitors, viewers, managers, owners, facilitators and administrators.",
    },
    {
      page: "listing-fields",
      label: "Listings",
      summary: "Every field of a listing, its status, and what the marketplace filters read from it.",
    },
    {
      page: "relation-types",
      label: "Connection types",
      summary: "The six ways two organisations can be linked, and what direction means.",
    },
    {
      page: "notification-types",
      label: "Notifications",
      summary: "Each notification, what triggers it, where it leads, and which ones cannot be turned off.",
    },
    {
      page: "compass-questionnaires",
      label: "Compass questionnaires",
      summary: "Question types, answer statuses, how a score is computed and what the result bands mean.",
    },
    {
      page: "network-records",
      label: "Network records",
      summary: "What a facilitator keeps on an organisation: health, needs, business data, interactions, tasks.",
    },
    {
      page: "data-sources",
      label: "Data sources",
      summary: "The Rotterdam and Athens business registers behind the Data map, and how to read it.",
    },
  ],
};
