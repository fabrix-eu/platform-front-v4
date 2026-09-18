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
        <Card className="max-h-72 space-y-2.5 overflow-y-auto p-4">
          {categories.map((category) => (
            <Checkbox
              key={category.slug}
              checked={selected.includes(category.slug)}
              onChange={() => onToggleCategory(category.slug)}
              label={
                <span className="flex items-center gap-2 text-fx-small">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-[3px]" style={{ background: category.color_hex }} />
                  {category.name}
                </span>
              }
            />
          ))}
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
