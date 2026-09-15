import type { SelectOption } from "@/components/SelectField";

// The prototype asks for turnover as a band. The API stores an integer (`turnover`),
// so a band is saved as its lower bound, and any amount already stored reads back
// as the band it falls in.
const TURNOVER_BANDS = [
  { value: "0", label: "under €500k", min: 0 },
  { value: "500000", label: "€500k–2M", min: 500_000 },
  { value: "2000000", label: "€2M–10M", min: 2_000_000 },
  { value: "10000000", label: "€10M–50M", min: 10_000_000 },
  { value: "50000000", label: "€50M–200M", min: 50_000_000 },
  { value: "200000000", label: "over €200M", min: 200_000_000 },
];

export const TURNOVER_OPTIONS: SelectOption[] = TURNOVER_BANDS.map(({ value, label }) => ({ value, label }));

/** The band value ("" = prefer not to say) for a stored turnover. */
export function turnoverBand(turnover: number | null | undefined): string {
  if (turnover == null) return "";
  return [...TURNOVER_BANDS].reverse().find((band) => turnover >= band.min)?.value ?? "0";
}

// development_stage values the old editor wrote, and that production holds.
export const DEVELOPMENT_STAGES: SelectOption[] = [
  { value: "startup", label: "1–5 years (start-up)" },
  { value: "growth", label: "2–10 years (growth)" },
  { value: "maturing", label: "5–20 years (maturing)" },
  { value: "expansion", label: "10 years + (expansion or renewal)" },
  { value: "succession", label: "Succession or exit" },
];

/** The size band a headcount belongs to (EU size classes). */
export function sizeBand(people: number): string {
  if (people < 10) return "1–9 people";
  if (people < 50) return "10–49 people";
  if (people < 250) return "50–249 people";
  return "250+ people";
}
