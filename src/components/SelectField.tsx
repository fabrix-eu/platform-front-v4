import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "./Field";
import { FieldError, fieldError, type AnyMutation } from "./FieldError";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  mutation: AnyMutation;
  options: SelectOption[];
  defaultValue?: string | null;
  /** Shown as an empty first option; read it back as "" and coerce to null before sending. */
  placeholder?: string;
  required?: boolean;
}

// Native <select> (uncontrolled): read with fd.get(name).
export function SelectField({ label, name, mutation, options, defaultValue, placeholder, required }: SelectFieldProps) {
  const invalid = !!fieldError(mutation, name);
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && " *"}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          required={required}
          defaultValue={defaultValue ?? ""}
          aria-invalid={invalid || undefined}
          className={cn(inputClass, "appearance-none pr-10")}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fx-muted" />
      </div>
      <FieldError mutation={mutation} field={name} />
    </div>
  );
}
