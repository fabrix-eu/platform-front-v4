import { Building2, LineChart, MapPin, type LucideIcon } from "lucide-react";

export interface DataAudience {
  icon: LucideIcon;
  tile: string;
  title: string;
  blurb: string;
  /** One question the data answers, and how. */
  questions: { lead: string; text: string }[];
}

// Who the Data page is for, and the questions the datasets above actually answer.
export const DATA_AUDIENCES: DataAudience[] = [
  {
    icon: LineChart,
    tile: "bg-fx-green-soft text-fx-green",
    title: "Researchers",
    blurb: "You study a territory's textile chain and need the whole population, not only the members.",
    questions: [
      { lead: "Where the chain sits", text: "in a city, at address level, by activity: production, wholesale, retail, repair, design." },
      { lead: "How it moved", text: "Rotterdam at several points in time, the Netherlands at six, with jobs rather than only counts." },
      { lead: "Register versus platform", text: "the whole population next to the members, so a study can say what share of a district FABRIX reaches." },
      { lead: "Practices", text: "Impact Compass results, as aggregated scores by kind and country." },
    ],
  },
  {
    icon: Building2,
    tile: "bg-fx-teal-soft text-fx-teal",
    title: "Policy makers",
    blurb: "You steer support for the sector and need figures that compare across years and places.",
    questions: [
      { lead: "Size of the sector", text: "businesses and jobs by activity and municipality, comparable across years." },
      { lead: "Gaps in the loop", text: "many brands and factories, few collectors, sorters or recyclers: the imbalance shows in the network's own figures." },
      { lead: "Who is organised", text: "the facilitator networks, the organisations they follow, the relations declared between organisations." },
      { lead: "Demand signals", text: "what organisations post as needs and offers on the Marketplace, by category." },
    ],
  },
  {
    icon: MapPin,
    tile: "bg-fx-amber-soft text-fx-amber",
    title: "Urban planners",
    blurb: "You plan districts and sites and need density and proximity, block by block.",
    questions: [
      { lead: "Density", text: "the map's 500-metre cells with a count each, for a district plan or a site search." },
      { lead: "Proximity", text: "which activities sit near which: a sorting facility next to a retail cluster is a different plan from one at the port." },
      { lead: "Vacancy and turnover", text: "what disappeared between two snapshots of the register." },
      { lead: "Candidates", text: "dense cells with no FABRIX member nearby, where a facilitator should knock." },
    ],
  },
];
