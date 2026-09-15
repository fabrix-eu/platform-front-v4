import { Building2, Compass, MapPin, Network, Recycle, TrendingUp, Users, type LucideIcon } from "lucide-react";

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

// The three ways into FABRIX. Organisations and viewers start at /register: its first
// step asks for the organisation, and offers an account without one. Facilitators are
// set up by the FABRIX team, so their card is an email.
export const AUDIENCES: Audience[] = [
  {
    icon: Building2,
    tile: "bg-fx-emphasis-soft text-fx-emphasis",
    title: "Organisations",
    blurb: "An SME, a micro-business, an independent designer or producer, a consultant.",
    points: [
      { icon: TrendingUp, text: "Measure your environmental and social practices" },
      { icon: MapPin, text: "Find supply-chain partners nearby" },
      { icon: Recycle, text: "Make your business local and circular" },
    ],
    cta: "Sign up as an organisation",
  },
  {
    icon: Users,
    tile: "bg-fx-teal-soft text-fx-teal",
    title: "Facilitators",
    blurb: "An incubator, a co-working space, a lab, a trade association, a public authority.",
    points: [
      { icon: MapPin, text: "Map and manage your network" },
      { icon: Network, text: "Match members into real partnerships" },
      { icon: TrendingUp, text: "Measure the connections you create" },
    ],
    cta: "Contact us to become a facilitator",
    contactEmail: "adrian@osmosnetwork.com",
  },
  {
    icon: Compass,
    tile: "bg-fx-green-soft text-fx-green",
    title: "Viewers",
    blurb: "Anyone who wants to explore the ecosystem before taking part in it.",
    points: [
      { icon: MapPin, text: "Browse the directory and the map" },
      { icon: Network, text: "Discover organisations and initiatives" },
      { icon: Recycle, text: "Follow what the pilot cities are doing" },
    ],
    cta: "Sign up as a viewer",
  },
];
