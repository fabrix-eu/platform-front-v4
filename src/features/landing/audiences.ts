import { Building2, LineChart, MapPin, Network, Users, type LucideIcon } from "lucide-react";

export interface Audience {
  icon: LucideIcon;
  /** Icon tile: soft fill + accent ink. */
  tile: string;
  title: string;
  blurb: string;
  points: { icon: LucideIcon; text: string }[];
  cta: string;
  /** Set when the way in is an email to the team rather than /register. */
  contactEmail?: string;
}

const DEMO_EMAIL = "adrian@osmosnetwork.com";

/**
 * Who FABRIX serves besides the businesses themselves. Organisations are no longer a
 * card here: the whole page above is addressed to them, and repeating them as one
 * option among three made the page look undecided about who it is for.
 *
 * Facilitators and urban administrators are set up by the FABRIX team, so their way in
 * is an email. Researchers can sign up today — the source copy marked that "forthcoming",
 * but an account without an organisation already works, and hiding a working door is
 * worse than a modest one.
 */
export const AUDIENCES: Audience[] = [
  {
    icon: Users,
    tile: "bg-fx-teal-soft text-fx-teal",
    title: "Facilitators",
    blurb:
      "You support the textile and clothing network in any way — an incubator, a co-working space, a lab, a trade association, a union, a public authority.",
    points: [
      { icon: MapPin, text: "Monitor the ecosystem you look after" },
      { icon: Network, text: "Match members into real partnerships" },
      { icon: LineChart, text: "Predict and assist, with the data behind it" },
    ],
    cta: "Contact us for a demo",
    contactEmail: DEMO_EMAIL,
  },
  {
    icon: LineChart,
    tile: "bg-fx-green-soft text-fx-green",
    title: "Researchers",
    blurb:
      "You work in policy, urban planning, or anywhere sustainable networks matter, and you need to see the shape of the industry.",
    points: [
      { icon: MapPin, text: "Browse the directory and the map" },
      { icon: Network, text: "Follow what the pilot cities are doing" },
      { icon: LineChart, text: "Access a range of anonymised data" },
    ],
    cta: "Sign up as a viewer",
  },
  {
    icon: Building2,
    tile: "bg-fx-indigo-soft text-fx-indigo",
    title: "Urban administrators",
    blurb:
      "You represent an urban area as a planner or an administrator, and you want policy that supports circular urban business.",
    points: [
      { icon: MapPin, text: "See where production actually happens" },
      { icon: LineChart, text: "Map the industry over time" },
      { icon: Network, text: "Replicate the method in your own city" },
    ],
    cta: "Contact us for a demo",
    contactEmail: DEMO_EMAIL,
  },
];
