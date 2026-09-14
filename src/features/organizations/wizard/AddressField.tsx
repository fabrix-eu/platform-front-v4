import { useState, type KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounced } from "@/lib/useDebounced";
import { inputClass, labelClass } from "@/components/Field";
import { FieldError, type AnyMutation } from "@/components/FieldError";
import { searchAddress, type AddressSuggestion } from "../geocoding";
import type { OrganizationDraft } from "../types";

type Picked = Pick<AddressSuggestion, "label" | "lat" | "lon" | "country_code">;

interface AddressFieldProps {
  initial?: Partial<OrganizationDraft>;
  error?: string | null;
  onPicked?: () => void;
  mutation: AnyMutation;
}

// A combobox over Photon. The typed text is only a search: what is sent is the picked
// place (hidden inputs), so the organisation always lands on the map.
export function AddressField({ initial, error, onPicked, mutation }: AddressFieldProps) {
  const start = initial?.address && initial.lat != null && initial.lon != null
    ? { label: initial.address, lat: initial.lat, lon: initial.lon, country_code: initial.country_code ?? "" }
    : null;
  // Combobox state is ephemeral by nature: the text, the open list, the highlighted row.
  const [picked, setPicked] = useState<Picked | null>(start);
  const [text, setText] = useState(initial?.address ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const term = useDebounced(text.trim(), 300);

  const query = useQuery({
    queryKey: ["geocoding", term],
    queryFn: () => searchAddress(term),
    enabled: open && !picked && term.length >= 3,
    staleTime: 5 * 60_000,
  });
  const suggestions = open && !picked ? (query.data ?? []) : [];

  const pick = (s: AddressSuggestion) => {
    setPicked(s);
    setText(s.label);
    setOpen(false);
    onPicked?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      pick(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div>
      <label htmlFor="address-search" className={labelClass}>
        Address *
      </label>
      <div className="relative">
        <MapPin aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fx-muted" />
        <input
          id="address-search"
          role="combobox"
          aria-expanded={suggestions.length > 0}
          aria-controls="address-suggestions"
          aria-autocomplete="list"
          aria-invalid={!!error || undefined}
          autoComplete="off"
          placeholder="Start typing the street and the city"
          value={text}
          onChange={(e) => {
            setText(e.currentTarget.value);
            setPicked(null);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className={cn(inputClass, "pl-10")}
        />
        {suggestions.length > 0 && (
          <ul
            id="address-suggestions"
            role="listbox"
            onMouseDown={(e) => e.preventDefault()}
            className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-64 overflow-y-auto rounded-fx border border-fx-line bg-fx-paper p-1.5 shadow-lg shadow-fx-ink/5"
          >
            {suggestions.map((s, i) => (
              <li
                key={s.id}
                role="option"
                aria-selected={i === active}
                onClick={() => pick(s)}
                onMouseEnter={() => setActive(i)}
                className={cn("flex cursor-pointer items-center gap-2.5 rounded-fx-sm px-3 py-2 text-fx-body text-fx-ink", i === active && "bg-fx-panel")}
              >
                <MapPin aria-hidden className="size-4 shrink-0 text-fx-muted" />
                {s.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input type="hidden" name="address" value={picked?.label ?? ""} />
      <input type="hidden" name="lat" value={picked?.lat ?? ""} />
      <input type="hidden" name="lon" value={picked?.lon ?? ""} />
      <input type="hidden" name="country_code" value={picked?.country_code ?? ""} />

      {picked ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-fx-small font-bold text-fx-green">
          <Check aria-hidden className="size-3.5" strokeWidth={3} />
          On the map{picked.country_code && ` · ${picked.country_code}`}
        </p>
      ) : error ? (
        <p className="mt-1.5 text-fx-small text-fx-rose">{error}</p>
      ) : (
        <p className="mt-1.5 text-fx-small text-fx-muted">Pick it from the suggestions — it puts you on the map.</p>
      )}
      <FieldError mutation={mutation} field="address" />
      <FieldError mutation={mutation} field="country_code" />
    </div>
  );
}
