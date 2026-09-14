import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "./Field";
import { FieldError, fieldError, type AnyMutation } from "./FieldError";

interface TextareaFieldProps {
  label: string;
  name: string;
  mutation: AnyMutation;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}

export function TextareaField({ label, name, mutation, defaultValue, placeholder, rows = 4, required }: TextareaFieldProps) {
  const invalid = !!fieldError(mutation, name);
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && " *"}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? undefined}
        aria-invalid={invalid || undefined}
        className={cn(inputClass, "resize-y leading-[1.55]")}
      />
      <FieldError mutation={mutation} field={name} />
    </div>
  );
}
