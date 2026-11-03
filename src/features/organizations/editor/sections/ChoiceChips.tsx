import type { ChangeEvent } from "react";
import { labelClass } from "@/components/Field";
import { FieldError, type AnyMutation } from "@/components/FieldError";
import type { SelectOption } from "@/components/SelectField";

interface ChoiceChipsProps {
  label: string;
  name: string;
  options: SelectOption[];
  defaultValue: string[];
  mutation: AnyMutation;
  hint?: string;
  /** A value that rules out every other ("None"): ticking it clears them, and the reverse. */
  exclusive?: string;
}

// "Choose as many as apply": native checkboxes dressed as pills, so they stay
// uncontrolled and FormData reads them with getAll(name).
export function ChoiceChips({ label, name, options, defaultValue, mutation, hint, exclusive }: ChoiceChipsProps) {
  const onChange = (e: ChangeEvent<HTMLFieldSetElement>) => {
    const input = e.target as unknown as HTMLInputElement;
    if (!exclusive || input.name !== name || !input.checked) return;
    const boxes = e.currentTarget.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`);
    boxes.forEach((box) => {
      if (box !== input && (input.value === exclusive || box.value === exclusive)) box.checked = false;
    });
  };

  return (
    <fieldset onChange={onChange}>
      <legend className={labelClass}>{label}</legend>
      {hint && <p className="-mt-1 mb-3 text-fx-small text-fx-muted">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input type="checkbox" name={name} value={option.value} defaultChecked={defaultValue.includes(option.value)} className="peer sr-only" />
            <span
              className={
                "inline-flex items-center rounded-full border border-fx-line2 bg-fx-paper px-4 py-2 font-fx-text text-fx-small font-bold " +
                "text-fx-ink2 transition hover:border-fx-emphasis peer-checked:border-fx-emphasis peer-checked:bg-fx-emphasis " +
                "peer-checked:text-fx-emphasis-ink peer-focus-visible:ring-3 peer-focus-visible:ring-fx-emphasis-soft"
              }
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
      <FieldError mutation={mutation} field={name} />
    </fieldset>
  );
}
