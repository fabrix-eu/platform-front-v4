import { LayoutGrid, Map, Share2, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SearchInput } from "@/components/ui/SearchInput";
import { EU_COUNTRIES } from "@/features/explore/countries";
import { CATEGORIES_BY_TYPE, categoryLabel } from "@/features/listings/taxonomy";
import { ORG_KIND_LABELS } from "@/features/organizations/kinds";
import { MultiSelectMenu } from "./MultiSelectMenu";
import { HEALTH_LABELS } from "./types";
import { csvList, hasOrgFilters, toggleCsv, type NetworkSearch, type OrgView } from "./search";

const KIND_OPTIONS = Object.entries(ORG_KIND_LABELS).map(([value, label]) => ({ value, label }));

/** Every specialty a filter can offer: the categories, which is what orgs carry. */
const SPECIALTY_OPTIONS = Object.values(CATEGORIES_BY_TYPE)
  .flat()
  .map((value) => ({ value, label: categoryLabel(value) }));

const VIEWS: { key: OrgView; label: string; icon: typeof Table2 }[] = [
  { key: "table", label: "Table", icon: Table2 },
  { key: "cards", label: "Cards", icon: LayoutGrid },
  { key: "map", label: "Map", icon: Map },
  { key: "graph", label: "Graph", icon: Share2 },
];

interface FiltersProps {
  search: NetworkSearch;
  onChange: (patch: Partial<NetworkSearch>) => void;
}

export function ViewToggle({ view, onChange }: { view: OrgView; onChange: (view: OrgView) => void }) {
  return (
    <div role="group" aria-label="View" className="flex rounded-fx-action border border-fx-line2 bg-fx-paper p-0.5">
      {VIEWS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          aria-pressed={view === key}
          onClick={() => onChange(key)}
          className={cn(
            "flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-fx-small font-bold transition",
            view === key ? "bg-fx-emphasis text-fx-emphasis-ink" : "text-fx-ink2 hover:text-fx-ink",
          )}
        >
          <Icon aria-hidden className="size-4" />
          <span className="max-sm:sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.currentTarget.value)} className={cn(inputClass, "py-2.5")}>
      {children}
    </select>
  );
}

/** What this network follows, narrowed by what the organisations actually are. */
export function OrganisationFilters({ search, onChange }: FiltersProps) {
  const kinds = csvList(search.kinds);
  const specialties = csvList(search.specialties);

  return (
    <div className="grid gap-5 rounded-fx-lg border border-fx-line bg-fx-paper p-5">
      <SearchInput
        defaultValue={search.q ?? ""}
        placeholder="Search the organisations you follow"
        aria-label="Search the organisations you follow"
        onChange={(e) => onChange({ q: e.currentTarget.value.trim() || undefined })}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Eyebrow className="mb-2">What they do</Eyebrow>
          <MultiSelectMenu
            label="What they do"
            options={KIND_OPTIONS}
            selected={kinds}
            onToggle={(value) => onChange({ kinds: toggleCsv(search.kinds, value) })}
            onClear={() => onChange({ kinds: undefined })}
          />
        </div>

        <div>
          <Eyebrow className="mb-2">Specialities</Eyebrow>
          <MultiSelectMenu
            label="Specialities"
            options={SPECIALTY_OPTIONS}
            selected={specialties}
            onToggle={(value) => onChange({ specialties: toggleCsv(search.specialties, value) })}
            onClear={() => onChange({ specialties: undefined })}
          />
        </div>

        <div>
          <Eyebrow className="mb-2">Economic health</Eyebrow>
          <Select label="Economic health" value={search.health ?? ""} onChange={(v) => onChange({ health: v || undefined })}>
            <option value="">Any</option>
            {Object.entries(HEALTH_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
        </div>

        <div>
          <Eyebrow className="mb-2">Country</Eyebrow>
          <Select label="Country" value={search.country ?? ""} onChange={(v) => onChange({ country: v || undefined })}>
            <option value="">All countries</option>
            {EU_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>{country.name}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* The API filters on the workforce the organisation declares on its own
          profile — not on the "Employees" figure this network keeps in its CRM,
          which the table shows. Two numbers, so two names. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Eyebrow className="mb-2">Workforce, min</Eyebrow>
          <input
            type="number"
            min={0}
            aria-label="Minimum workforce declared by the organisation"
            defaultValue={search.min_workers ?? ""}
            onBlur={(e) => onChange({ min_workers: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })}
            className={cn(inputClass, "py-2.5")}
          />
        </div>

        <div>
          <Eyebrow className="mb-2">Workforce, max</Eyebrow>
          <input
            type="number"
            min={0}
            aria-label="Maximum workforce declared by the organisation"
            defaultValue={search.max_workers ?? ""}
            onBlur={(e) => onChange({ max_workers: e.currentTarget.value ? Number(e.currentTarget.value) : undefined })}
            className={cn(inputClass, "py-2.5")}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-fx-label text-fx-muted">
          Workforce is what the organisation declares on its profile. The table’s “Employees” column is the
          figure this network keeps in its own record.
        </p>
        {hasOrgFilters(search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({ q: undefined, kinds: undefined, specialties: undefined, health: undefined, country: undefined, min_workers: undefined, max_workers: undefined })
            }
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
