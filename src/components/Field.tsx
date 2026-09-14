import { FieldError, fieldError, type AnyMutation } from "./FieldError";

export const labelClass = "mb-2 block font-fx-display text-fx-label text-fx-muted uppercase";

export const inputClass =
  "w-full rounded-fx border border-fx-line2 bg-fx-paper px-4 py-3 text-fx-body text-fx-ink " +
  "placeholder:text-fx-muted focus:border-fx-emphasis focus:ring-3 focus:ring-fx-emphasis-soft focus:outline-none " +
  "aria-invalid:border-fx-rose";

interface FieldProps {
  label: string;
  name: string;
  mutation: AnyMutation;
  type?: string;
  defaultValue?: string | null;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

// Uncontrolled input: no value/onChange, edit pre-fills via defaultValue.
export function Field({ label, name, mutation, type = "text", defaultValue, placeholder, required, autoComplete }: FieldProps) {
  const invalid = !!fieldError(mutation, name);
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${name}-error` : undefined}
        className={inputClass}
      />
      <FieldError mutation={mutation} field={name} id={`${name}-error`} />
    </div>
  );
}
