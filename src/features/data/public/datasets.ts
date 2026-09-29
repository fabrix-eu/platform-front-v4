import type { BadgeTone } from "@/components/ui/Badge";
import { CITY_CONFIG } from "../cities";
import { type DataSummary, formatCount } from "./api";

export type DatasetStatus = "members" | "returning" | "platform";

export interface Dataset {
  key: "rotterdam" | "athens" | "netherlands_employment" | "belgium_companies" | "network";
  label: string;
  source: string;
  territory: string;
  tone: BadgeTone;
  unit: string;
  covers: string;
  fields: string;
  notIn: string;
  status: DatasetStatus;
}

export const STATUS_LABELS: Record<DatasetStatus, string> = {
  members: "On the map, for members",
  returning: "Loaded, being put back",
  platform: "The platform itself",
};

/**
 * The five datasets FABRIX holds. The two registers reuse the city definitions the map
 * is built from, so the page and the map never disagree on a source.
 */
export const DATASETS: Dataset[] = [
  {
    key: "rotterdam",
    label: "Rotterdam business register",
    source: CITY_CONFIG.rotterdam.source,
    territory: CITY_CONFIG.rotterdam.place,
    tone: CITY_CONFIG.rotterdam.tone,
    unit: "establishment-years",
    covers: "Every registered textile and clothing business of the metropolitan area, at several points in time.",
    fields: "Name, address and coordinates, activity code, jobs and size class.",
    notIn: "Turnover and ownership. Jobs by gender are held but never shown per establishment.",
    status: "members",
  },
  {
    key: "athens",
    label: "Athens commercial register",
    source: CITY_CONFIG.athens.source,
    territory: CITY_CONFIG.athens.place,
    tone: CITY_CONFIG.athens.tone,
    unit: "companies",
    covers: "Every registered company of the textile and clothing chain, one current snapshot.",
    fields: "Name, address and coordinates, legal type and status, start date, one main activity and any secondary ones.",
    notIn: "Contact details and management are held but never shown.",
    status: "members",
  },
  {
    key: "netherlands_employment",
    label: "Netherlands employment series",
    source: "LISA",
    territory: "Netherlands, every municipality",
    tone: "indigo",
    unit: "rows",
    covers: "Jobs by location, sector and year, six snapshots from 1997 to 2022: the national context behind the Rotterdam map.",
    fields: "Jobs, full-time and part-time, per activity sector and location.",
    notIn: "Individual businesses: this series is aggregates only.",
    status: "returning",
  },
  {
    key: "belgium_companies",
    label: "Belgium company database",
    source: "Bureau van Dijk",
    territory: "Belgium, textile-related companies",
    tone: "indigo",
    unit: "companies",
    covers: "Size, financials and activities per company, with Antwerp, Ghent and Kortrijk leading.",
    fields: "Employees, turnover, activity codes, corporate group, town.",
    notIn: "Licensed data, shared as aggregates only.",
    status: "returning",
  },
  {
    key: "network",
    label: "The FABRIX network",
    source: "The platform",
    territory: "Europe, mostly the Netherlands, Greece and France",
    tone: "green",
    unit: "organisations",
    covers: "The organisations on FABRIX, the relations they declare, what they offer and need, their events and Impact Compass results.",
    fields: "Kind, activities, location, relations by type, listings by category, assessment completion.",
    notIn: "Names, in the figures: the network is counted by country, kind and type only.",
    status: "platform",
  },
];

/** "129,766 establishment-years · 2012, 2017, 2022" from the live summary. */
export function coverage(dataset: Dataset, summary: DataSummary): string {
  if (dataset.key === "network") return `${formatCount(summary.network.organizations)} ${dataset.unit}`;
  const entry = summary.datasets[dataset.key];
  const years = "years" in entry ? entry.years.map((y) => y.year).join(", ") : undefined;
  return years ? `${formatCount(entry.rows)} ${dataset.unit} · ${years}` : `${formatCount(entry.rows)} ${dataset.unit}`;
}
