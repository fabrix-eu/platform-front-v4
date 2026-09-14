import { FieldError, type AnyMutation } from "./FieldError";

interface FieldProps {
  label: string;
  name: string;
  mutation: AnyMutation;
  type?: string;
  defaultValue?: string | null;
  required?: boolean;
  autoComplete?: string;
}

export const inputClass =
  "w-full rounded-fx-sm border border-fx-line2 bg-fx-paper px-3.5 py-2.5 text-fx-body text-fx-ink " +
  "placeholder:text-fx-muted focus:border-fx-emphasis focus:outline-none focus:ring-3 focus:ring-fx-emphasis-soft";

// Uncontrolled input: no value/onChange, edit pre-fills via defaultValue.
export function Field({ label, name, mutation, type = "text", defaultValue, required, autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-fx-small font-bold text-fx-ink">
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue ?? undefined}
        className={inputClass}
      />
      <FieldError mutation={mutation} field={name} />
    </div>
  );
}
