import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { menuContentClass, menuItemClass } from "@/components/ui/menu";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectMenuProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}

/**
 * A multi-value filter that stays one control. Laying every option out as a
 * permanent pill turns two filters into thirty-five objects on the page; here
 * the list is behind a menu and only the chosen values stay visible.
 */
export function MultiSelectMenu({ label, options, selected, onToggle, onClear }: MultiSelectMenuProps) {
  const chosen = options.filter((option) => selected.includes(option.value));

  return (
    <div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className={cn(inputClass, "flex items-center justify-between gap-2 py-2.5 text-left")}
          >
            <span className="truncate text-fx-ink2">
              {chosen.length === 0 ? "Any" : `${chosen.length} selected`}
            </span>
            <ChevronDown aria-hidden className="size-4 shrink-0 text-fx-muted" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="start"
            sideOffset={6}
            className={cn(menuContentClass, "max-h-80 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto")}
          >
            {options.map((option) => {
              const checked = selected.includes(option.value);
              return (
                <DropdownMenu.CheckboxItem
                  key={option.value}
                  checked={checked}
                  // Without this the menu closes on every tick, and picking three
                  // values would mean opening it three times.
                  onSelect={(event) => event.preventDefault()}
                  onCheckedChange={() => onToggle(option.value)}
                  className={menuItemClass}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-[5px] border-2 transition",
                      checked ? "border-fx-emphasis bg-fx-emphasis text-fx-emphasis-ink" : "border-fx-line2 text-transparent",
                    )}
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </DropdownMenu.CheckboxItem>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {chosen.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {chosen.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onToggle(option.value)}
                aria-label={`Remove ${option.label} from ${label}`}
                className="flex items-center gap-1.5 rounded-full bg-fx-emphasis-soft px-2.5 py-1 text-fx-label font-bold text-fx-emphasis transition hover:brightness-95"
              >
                {option.label}
                <X aria-hidden className="size-3" strokeWidth={3} />
              </button>
            </li>
          ))}
          {chosen.length > 1 && (
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
