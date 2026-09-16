import { useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown, LayoutGrid, List, Map, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PillLink } from "@/components/ui/Pill";
import { SearchInput } from "@/components/ui/SearchInput";
import { EU_COUNTRIES } from "@/features/explore/countries";
import { RADIUS_OPTIONS, type ResolvedLocation } from "@/features/explore/location";
import type { EventsSearch } from "./search";

/** Uncontrolled, debounced into ?search= — the URL is the only place the term lives. */
export function EventsSearchBox({ value }: { value?: string }) {
  const navigate = useNavigate({ from: "/events/" });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <SearchInput
      defaultValue={value}
      placeholder="Search events"
      aria-label="Search events"
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

export function WhenFilter({ when }: { when: "upcoming" | "past" }) {
  return (
    <div>
      <Eyebrow className="mb-3">When</Eyebrow>
      <div className="flex flex-wrap gap-2">
        <PillLink to="/events" search={(prev) => ({ ...prev, when: undefined })} active={when === "upcoming"} resetScroll={false}>
          Upcoming
        </PillLink>
        <PillLink to="/events" search={(prev) => ({ ...prev, when: "past" as const })} active={when === "past"} resetScroll={false}>
          Past
        </PillLink>
      </div>
    </div>
  );
}

const selectClass = cn(inputClass, "appearance-none py-2.5 pr-10");

export function EventsLocationFilter({ search, location, hasMyLocation }: { search: EventsSearch; location: ResolvedLocation; hasMyLocation: boolean }) {
  const navigate = useNavigate({ from: "/events/" });
  const set = (patch: Partial<EventsSearch>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  return (
    <div>
      <Eyebrow className="mb-3">Location</Eyebrow>
      <div className="space-y-3">
        {hasMyLocation && (
          <div className="flex flex-wrap gap-2">
            <PillLink to="/events" search={(prev) => ({ ...prev, near: undefined })} active={location.active} resetScroll={false}>
              <MapPin className="size-3.5" />
              Near my organisation
            </PillLink>
            <PillLink to="/events" search={(prev) => ({ ...prev, near: "all" as const })} active={!location.active} resetScroll={false}>
              Everywhere
            </PillLink>
          </div>
        )}

        {location.active && (
          <div className="relative">
            <select
              aria-label="Radius"
              value={String(location.radius)}
              onChange={(e) => set({ radius: Number(e.target.value) })}
              className={selectClass}
            >
              {RADIUS_OPTIONS.map((km) => (
                <option key={km} value={km}>
                  Within {km} km
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fx-muted" />
          </div>
        )}

        <div className="relative">
          <select aria-label="Country" value={search.country ?? ""} onChange={(e) => set({ country: e.target.value || undefined })} className={selectClass}>
            <option value="">All countries</option>
            {EU_COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fx-muted" />
        </div>
      </div>
    </div>
  );
}

const VIEWS = [
  { key: "cards", label: "Cards", icon: LayoutGrid },
  { key: "list", label: "List", icon: List },
  { key: "map", label: "Map", icon: Map },
] as const;

export function EventsViewToggle({ view }: { view: "cards" | "list" | "map" }) {
  return (
    <div role="group" aria-label="View" className="flex rounded-fx-action border border-fx-line2 bg-fx-paper p-0.5">
      {VIEWS.map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          to="/events"
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
