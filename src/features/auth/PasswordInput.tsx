import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "@/components/Field";
import { FieldError, fieldError, type AnyMutation } from "@/components/FieldError";

interface PasswordInputProps {
  name: string;
  label: string;
  mutation: AnyMutation;
  autoComplete: "current-password" | "new-password";
  labelAside?: ReactNode;
}

export function PasswordInput({ name, label, mutation, autoComplete, labelAside }: PasswordInputProps) {
  // Ephemeral: the field stays uncontrolled, only its `type` flips, so FormData still reads it.
  const [visible, setVisible] = useState(false);
  const invalid = !!fieldError(mutation, name);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={name} className={cn(labelClass, "mb-0")}>
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          aria-invalid={invalid || undefined}
          className={cn(inputClass, "pr-11")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          aria-controls={name}
          className="absolute inset-y-0 right-0 flex items-center px-3.5 text-fx-muted hover:text-fx-ink"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <FieldError mutation={mutation} field={name} />
    </div>
  );
}
