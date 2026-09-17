import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { menuContentClass, menuItemClass, menuLabelClass, menuSeparatorClass } from "@/components/ui/menu";
import {
  CATEGORIES_BY_TYPE,
  categoryLabel,
  LISTING_TYPE_META,
  LISTING_TYPES,
  specialtyLabel,
  subcategoryOptions,
} from "@/features/listings/taxonomy";

interface SpecialtyFilterMenuProps {
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

function Tick({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-[5px] border-2 transition",
        checked ? "border-fx-emphasis bg-fx-emphasis text-fx-emphasis-ink" : "border-fx-line2 text-transparent",
      )}
    >
      <Check className="size-3" strokeWidth={3} />
    </span>
  );
}

/**
 * The listing taxonomy, the way the profile editor offers it: grouped by listing
 * type, a checkbox per category, and a picked category opening its subcategories.
 *
 * A type is a heading, never a value — organisations store categories and
 * subcategories in `specialties`, never the type, and the API's filter is a plain
 * array overlap that does not expand a category into its children.
 */
export function SpecialtyFilterMenu({ selected, onToggle, onClear }: SpecialtyFilterMenuProps) {
  const has = (value: string) => selected.includes(value);

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button type="button" className={cn(inputClass, "flex items-center justify-between gap-2 py-2.5 text-left")}>
            <span className="truncate text-fx-ink2">{selected.length === 0 ? "Any" : `${selected.length} selected`}</span>
            <ChevronDown aria-hidden className="size-4 shrink-0 text-fx-muted" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={6}
            className={cn(menuContentClass, "max-h-96 w-80 overflow-y-auto")}
          >
            {LISTING_TYPES.map((type, index) => (
              <div key={type}>
                {index > 0 && <DropdownMenu.Separator className={menuSeparatorClass} />}
                <DropdownMenu.Label className={menuLabelClass}>{LISTING_TYPE_META[type].label}</DropdownMenu.Label>

                {CATEGORIES_BY_TYPE[type].map((category) => (
                  <div key={category}>
                    <DropdownMenu.CheckboxItem
                      checked={has(category)}
                      // Kept open: picking a category then refining it would
                      // otherwise mean reopening the menu for every child.
                      onSelect={(event) => event.preventDefault()}
                      onCheckedChange={() => onToggle(category)}
                      className={menuItemClass}
                    >
                      <Tick checked={has(category)} />
                      <span className="min-w-0 flex-1 truncate">{categoryLabel(category)}</span>
                    </DropdownMenu.CheckboxItem>

                    {has(category) &&
                      subcategoryOptions(category).map((sub) => (
                        <DropdownMenu.CheckboxItem
                          key={sub.value}
                          checked={has(sub.value)}
                          onSelect={(event) => event.preventDefault()}
                          onCheckedChange={() => onToggle(sub.value)}
                          className={cn(menuItemClass, "ml-4 text-fx-small")}
                        >
                          <Tick checked={has(sub.value)} />
                          <span className="min-w-0 flex-1 truncate">{sub.label}</span>
                        </DropdownMenu.CheckboxItem>
                      ))}
                  </div>
                ))}
              </div>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {selected.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((value) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => onToggle(value)}
                aria-label={`Remove ${specialtyLabel(value) ?? value} from Specialities`}
                className="flex items-center gap-1.5 rounded-full bg-fx-emphasis-soft px-2.5 py-1 text-fx-label font-bold text-fx-emphasis transition hover:brightness-95"
              >
                {specialtyLabel(value) ?? value}
                <X aria-hidden className="size-3" strokeWidth={3} />
              </button>
            </li>
          ))}
          {selected.length > 1 && (
            <li>
              <button type="button" onClick={onClear} className="px-2 py-1 text-fx-label text-fx-muted hover:text-fx-ink">
                Clear
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
