import { labelClass } from "@/components/Field";
import { Checkbox } from "@/components/ui/Toggles";
import { cn } from "@/lib/utils";
import { DIRECTIONS, DIRECTION_META, ONE_OFF } from "../directions";
import type { Listing } from "../types";

// Native radios under the pills, so the form stays uncontrolled and FormData reads
// them like every other field — the same bargain the rest of this form makes.
const OPTION =
  "cursor-pointer rounded-full border border-fx-line2 bg-fx-paper px-4 py-2 font-fx-text text-fx-small font-bold text-fx-ink2 transition " +
  "hover:border-fx-emphasis peer-checked:border-fx-emphasis peer-checked:bg-fx-emphasis peer-checked:text-fx-emphasis-ink " +
  "peer-focus-visible:ring-3 peer-focus-visible:ring-fx-emphasis-soft";

/** The shape of the exchange: offered or wanted, once or ongoing. */
export function ListingShapeFields({ listing }: { listing?: Listing }) {
  const current = listing?.direction ?? "offering";

  return (
    <div className="space-y-5">
      <div>
        <span className={labelClass}>Which way round is it? *</span>
        <div role="radiogroup" aria-label="Offered or wanted" className="flex flex-wrap gap-2">
          {DIRECTIONS.map((value) => (
            <label key={value} className="inline-flex">
              <input
                type="radio"
                name="direction"
                value={value}
                defaultChecked={current === value}
                className="peer sr-only"
              />
              <span className={cn(OPTION)}>{DIRECTION_META[value].label}</span>
            </label>
          ))}
        </div>
      </div>

      <Checkbox
        name="one_off"
        defaultChecked={listing?.one_off ?? false}
        label={
          <span>
            <span className="text-fx-small font-bold text-fx-ink">{ONE_OFF.label}</span>
            <span className="mt-0.5 block text-fx-label text-fx-muted">{ONE_OFF.hint}</span>
          </span>
        }
      />
    </div>
  );
}
