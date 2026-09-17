import { Calendar, Compass, GraduationCap, MapPin, ShoppingBag, type LucideIcon } from "lucide-react";

export interface BusinessFeature {
  /** The verb, as the landing copy words it. */
  kicker: string;
  title: string;
  body: string;
  icon: LucideIcon;
  /** Soft fill + accent ink, one per section: the colour is what separates them. */
  tile: string;
  cta: string;
  /** An internal route, or an absolute URL for the Learning Hub. */
  to?: "/global" | "/marketplace" | "/events" | "/register";
  href?: string;
}

/**
 * What FABRIX does for a small business, in the order the landing tells it. The page
 * is written for the SME first — the other audiences come after, once this has
 * answered "what is in it for me".
 *
 * Only what the product actually does is listed here. The source copy also promised
 * job and funding listings; there are none, and a landing page that oversells is
 * found out on the first visit.
 */
export const BUSINESS_FEATURES: BusinessFeature[] = [
  {
    kicker: "Map",
    title: "Build connections",
    body:
      "You are not alone: small businesses deal with big problems every day. Mapping shows your local ecosystem — find yourself on it, create your profile, and find your next supplier, client or consultant. Or simply find your people.",
    icon: MapPin,
    tile: "bg-fx-emphasis-soft text-fx-emphasis",
    cta: "Explore the directory",
    to: "/global",
  },
  {
    kicker: "Market",
    title: "Sell and swap",
    body:
      "List what you have and find what you need. Offcuts you cannot use, help with ESPR, product photography — the marketplace is where supply meets demand, and it keeps things local and circular.",
    icon: ShoppingBag,
    tile: "bg-fx-green-soft text-fx-green",
    cta: "Browse the marketplace",
    to: "/marketplace",
  },
  {
    kicker: "Participate",
    title: "Find events near you",
    body:
      "Find the community you did not know existed. Events are run by FABRIX facilitators and by members like you, in the pilot cities and online.",
    icon: Calendar,
    tile: "bg-fx-amber-soft text-fx-amber",
    cta: "See what is on",
    to: "/events",
  },
  {
    kicker: "Measure",
    title: "Orient yourself with the Compass",
    body:
      "Want to know where you stand next to your peers on environmental management, product design or business models? The Compass asks, then gives short, useful feedback on what you could do next — inside the FABRIX ecosystem and outside it.",
    icon: Compass,
    tile: "bg-fx-teal-soft text-fx-teal",
    cta: "Create your profile",
    to: "/register",
  },
  {
    kicker: "Improve",
    title: "Explore the Learning Hub",
    body:
      "Turn industry catchwords into actionable to-do lists, learn new skills, and find inspiration from makers around you. Built from what the FABRIX project actually did, and from the real needs of its members.",
    icon: GraduationCap,
    tile: "bg-fx-indigo-soft text-fx-indigo",
    cta: "Open the Learning Hub",
    href: "https://learn.fabrixproject.eu",
  },
];
