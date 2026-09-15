import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FieldHint, inputClass, labelClass } from "./Field";
import { FieldError, fieldError, type AnyMutation } from "./FieldError";

interface TextareaFieldProps {
  label: string;
  name: string;
  mutation: AnyMutation;
  defaultValue?: string | null;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: ReactNode;
}

export function TextareaField({ label, name, mutation, defaultValue, placeholder, rows = 4, required, hint }: TextareaFieldProps) {
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
        aria-describedby={hint ? `${name}-hint` : undefined}
        className={cn(inputClass, "resize-y leading-[1.55]")}
      />
      {hint && <FieldHint id={`${name}-hint`}>{hint}</FieldHint>}
      <FieldError mutation={mutation} field={name} />
    </div>
  );
}
