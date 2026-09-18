import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Toggles";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { CityConfig, Year } from "./cities";
import type { NaceCategory } from "./api";

interface DataFiltersProps {
  city: CityConfig;
  categories: NaceCategory[];
  selected: string[];
  year: Year;
  hexbin: boolean;
  secondary: boolean;
  onToggleCategory: (slug: string) => void;
  onClear: () => void;
  onChange: (patch: { year?: Year; hexbin?: boolean; secondary?: boolean }) => void;
}

export function DataFilters({
  city, categories, selected, year, hexbin, secondary, onToggleCategory, onClear, onChange,
}: DataFiltersProps) {
  return (
    <div className="space-y-4">
      {city.years && (
        <div>
          <Eyebrow className="mb-2">Year</Eyebrow>
          <div className="relative">
            <select
              aria-label="Year"
              value={year}
              onChange={(event) => onChange({ year: Number(event.currentTarget.value) as Year })}
              className={cn(inputClass, "appearance-none py-2.5 pr-10")}
            >
              {city.years.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fx-muted" />
          </div>
          <p className="mt-2 text-fx-label text-fx-muted">Every five years, 1997 to 2022.</p>
        </div>
      )}

      {selected.length === 0 && (
        <Banner tone="info">Pick at least one activity to draw the map.</Banner>
      )}

      <div>
        <Eyebrow className="mb-2">Activities</Eyebrow>
        {/* A grid, not a wrapping row: the columns then line up even when one name
            runs to two lines and its neighbour does not. */}
        <Card className="max-h-72 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {categories.map((category) => (
              <Checkbox
                key={category.slug}
                className="gap-2"
                checked={selected.includes(category.slug)}
                onChange={() => onToggleCategory(category.slug)}
                label={
                  <span className="flex items-start gap-1.5 text-fx-small leading-snug">
                    <span
                      aria-hidden
                      className="mt-1 size-2.5 shrink-0 rounded-[3px]"
                      style={{ background: category.color_hex }}
                    />
                    {category.name}
                  </span>
                }
              />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <Checkbox
          checked={hexbin}
          onChange={(event) => onChange({ hexbin: event.currentTarget.checked })}
          label={
            <span>
              <span className="text-fx-small font-bold text-fx-ink">Group into cells</span>
              <span className="mt-0.5 block text-fx-label text-fx-muted">
                Density over ~500 m hexagons, instead of every address.
              </span>
            </span>
          }
        />
      </Card>

      {city.secondaryCodes && (
        <Card className="p-4">
          <Checkbox
            checked={secondary}
            onChange={(event) => onChange({ secondary: event.currentTarget.checked })}
            label={
              <span>
                <span className="text-fx-small font-bold text-fx-ink">Include secondary activities</span>
                <span className="mt-0.5 block text-fx-label text-fx-muted">
                  Match businesses that declare this work, even if it is not their main one.
                </span>
              </span>
            }
          />
        </Card>
      )}

      {selected.length > 0 && (
        <Button variant="outline" size="sm" className="w-full justify-center" onClick={onClear}>
          Clear activities
        </Button>
      )}
    </div>
  );
}
