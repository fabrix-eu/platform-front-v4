import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillLink } from "@/components/ui/Pill";
import { EU_COUNTRIES } from "@/features/explore/countries";
import { RADIUS_OPTIONS, type ResolvedLocation } from "@/features/explore/location";
import type { MarketplaceSearch } from "../search";

const selectClass = cn(inputClass, "appearance-none py-2.5 pr-10");

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fx-muted" />
    </div>
  );
}

interface LocationFilterProps {
  search: MarketplaceSearch;
  location: ResolvedLocation;
  hasMyLocation: boolean;
}

export function LocationFilter({ search, location, hasMyLocation }: LocationFilterProps) {
  const navigate = useNavigate({ from: "/marketplace/" });
  const set = (patch: Partial<MarketplaceSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  return (
    <div>
      <Eyebrow className="mb-3">Location</Eyebrow>
      <div className="space-y-3">
        {hasMyLocation && (
          <div className="flex flex-wrap gap-2">
            <PillLink to="/marketplace" search={(prev) => ({ ...prev, near: undefined })} active={location.active} resetScroll={false}>
              <MapPin className="size-3.5" />
              Near my organisation
            </PillLink>
            <PillLink to="/marketplace" search={(prev) => ({ ...prev, near: "all" as const })} active={!location.active} resetScroll={false}>
              Everywhere
            </PillLink>
          </div>
        )}
        {location.active && (
          <Select label="Radius" value={String(location.radius)} onChange={(v) => set({ radius: Number(v) })}>
            {RADIUS_OPTIONS.map((km) => (
              <option key={km} value={km}>
                Within {km} km
              </option>
            ))}
          </Select>
        )}
        <Select label="Country" value={search.country ?? ""} onChange={(v) => set({ country: v || undefined })}>
          <option value="">All countries</option>
          {EU_COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
