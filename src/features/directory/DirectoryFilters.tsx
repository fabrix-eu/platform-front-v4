import { useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LayoutGrid, List, Map, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill, PillLink } from "@/components/ui/Pill";
import { SearchInput } from "@/components/ui/SearchInput";
import { EU_COUNTRIES } from "@/features/explore/countries";
import { RADIUS_OPTIONS, type ResolvedLocation } from "@/features/explore/location";
import { ORG_KIND_LABELS } from "@/features/organizations/kinds";
import { kindList, toggleKind, type DirectorySearch } from "./search";

/** Uncontrolled, debounced into ?search= — the URL is the only place the term lives. */
export function DirectorySearchBox({ value }: { value?: string }) {
  const navigate = useNavigate({ from: "/global" });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <SearchInput
      defaultValue={value}
      placeholder="Search organisations"
      aria-label="Search organisations"
      onChange={(e) => {
        const term = e.currentTarget.value.trim();
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          navigate({ search: (prev) => ({ ...prev, search: term || undefined }), replace: true, resetScroll: false });
        }, 350);
      }}
    />
  );
}

export function KindFilter({ kinds }: { kinds?: string }) {
  const navigate = useNavigate({ from: "/global" });
  const selected = kindList(kinds);

  return (
    <div>
      <Eyebrow className="mb-3">What they do</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {Object.entries(ORG_KIND_LABELS).map(([kind, label]) => (
          <Pill
            key={kind}
            selected={selected.includes(kind)}
            onClick={() => navigate({ search: (prev) => ({ ...prev, kinds: toggleKind(kinds, kind) }), replace: true, resetScroll: false })}
          >
            {label}
          </Pill>
        ))}
      </div>
    </div>
  );
}

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

export function DirectoryPlaceFilter({ search, location, hasMyLocation }: { search: DirectorySearch; location: ResolvedLocation; hasMyLocation: boolean }) {
  const navigate = useNavigate({ from: "/global" });
  const set = (patch: Partial<DirectorySearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  return (
    <div>
      <Eyebrow className="mb-3">Where</Eyebrow>
      <div className="space-y-3">
        {hasMyLocation && (
          <div className="flex flex-wrap gap-2">
            <PillLink to="/global" search={(prev) => ({ ...prev, near: undefined })} active={location.active} resetScroll={false}>
              <MapPin className="size-3.5" />
              Near my organisation
            </PillLink>
            <PillLink to="/global" search={(prev) => ({ ...prev, near: "all" as const })} active={!location.active} resetScroll={false}>
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
          {EU_COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export function StatusFilter({ status }: { status?: "claimed" | "unclaimed" }) {
  return (
    <div>
      <Eyebrow className="mb-3">Status</Eyebrow>
      <div className="flex flex-wrap gap-2">
        <PillLink to="/global" search={(prev) => ({ ...prev, status: undefined })} active={!status} resetScroll={false}>
          All
        </PillLink>
        <PillLink to="/global" search={(prev) => ({ ...prev, status: "claimed" as const })} active={status === "claimed"} resetScroll={false}>
          On FABRIX
        </PillLink>
        <PillLink to="/global" search={(prev) => ({ ...prev, status: "unclaimed" as const })} active={status === "unclaimed"} resetScroll={false}>
          Claimable
        </PillLink>
      </div>
    </div>
  );
}

const VIEWS = [
  { key: "cards", label: "Cards", icon: LayoutGrid },
  { key: "list", label: "List", icon: List },
  { key: "map", label: "Map", icon: Map },
] as const;

export function DirectoryViewToggle({ view }: { view: "cards" | "list" | "map" }) {
  return (
    <div role="group" aria-label="View" className="flex rounded-fx-action border border-fx-line2 bg-fx-paper p-0.5">
      {VIEWS.map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          to="/global"
          search={(prev) => ({ ...prev, view: key === "cards" ? undefined : key })}
          replace
          resetScroll={false}
          aria-pressed={view === key}
          className={cn(
            "flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-fx-small font-bold transition",
            view === key ? "bg-fx-emphasis text-fx-emphasis-ink" : "text-fx-ink2 hover:text-fx-ink",
          )}
        >
          <Icon aria-hidden className="size-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}
