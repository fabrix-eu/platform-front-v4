import type { BadgeTone } from "@/components/ui/Badge";

/**
 * The two cities the project mapped, and everything that differs between them. The old
 * front carried one 600-line page per city, near-identical twins; here the page is one
 * component and the city is data.
 */
export const CITIES = ["rotterdam", "athens"] as const;

export type City = (typeof CITIES)[number];

/** Rotterdam's dataset is a time series; Athens' is a single snapshot. */
export const ROTTERDAM_YEARS = [2022, 2017, 2012, 2007, 2002, 1997] as const;

export type Year = (typeof ROTTERDAM_YEARS)[number];

export const isYear = (value: unknown): value is Year => ROTTERDAM_YEARS.includes(value as Year);

export interface CityConfig {
  key: City;
  label: string;
  place: string;
  /** The register the data comes from, shown next to the title. */
  source: string;
  tone: BadgeTone;
  centre: { lat: number; lng: number };
  zoom: number;
  /** Metres. Cells are drawn from the city centre's latitude, so they stay regular. */
  hexbinRadius: number;
  /** Only Rotterdam has history to pick from. */
  years?: readonly Year[];
  /** Only Athens lets a business match on its secondary activity codes. */
  secondaryCodes: boolean;
  about: { title: string; body: string }[];
}

export const CITY_CONFIG: Record<City, CityConfig> = {
  rotterdam: {
    key: "rotterdam",
    label: "Rotterdam",
    place: "Rotterdam, Netherlands",
    source: "LISA",
    tone: "amber",
    centre: { lat: 51.9244, lng: 4.4777 },
    zoom: 11,
    hexbinRadius: 500,
    years: ROTTERDAM_YEARS,
    secondaryCodes: false,
    about: [
      {
        title: "The LISA database",
        body:
          "LISA — Landelijk Informatiesysteem van Arbeidsplaatsen — is the Dutch national register of employment. It records every registered business in the Netherlands, with what it does and how many people work there.",
      },
      {
        title: "The Rotterdam metropolitan area",
        body:
          "This map keeps the textile and clothing businesses of the Rotterdam area, at six points in time: 1997, 2002, 2007, 2012, 2017 and 2022. Picking a year redraws the map as it was.",
      },
    ],
  },
  athens: {
    key: "athens",
    label: "Athens",
    place: "Athens, Greece",
    source: "GEMI",
    tone: "teal",
    centre: { lat: 37.9838, lng: 23.7275 },
    zoom: 11,
    hexbinRadius: 500,
    secondaryCodes: true,
    about: [
      {
        title: "The General Commercial Register (GEMI)",
        body:
          "GEMI is the official commercial register of Greece. It holds every registered company with its activities, its address and its NACE classification.",
      },
      {
        title: "Primary and secondary activities",
        body:
          "A company declares one main activity and may declare others. By default only the main one is matched; including secondary codes widens the map to everyone who does this work at all, not only those who do it first.",
      },
    ],
  },
};

/** Shared by both cities, so it is written once. */
export const ABOUT_VISUALISATION = {
  title: "How to read the map",
  body:
    "Each business is placed at its own address. Hexagonal binning instead groups them into cells of about 500 metres and sizes each cell by how many it holds — density rather than a mass of overlapping dots. A cell is drawn from five businesses upwards.",
};
