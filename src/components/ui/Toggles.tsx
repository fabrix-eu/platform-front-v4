import type { InputHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode };

// Both are native checkboxes, visually replaced: they stay uncontrolled
// (`name` + `defaultChecked`), so FormData reads them like any other field.

export function Switch({ label, className, ...rest }: ToggleProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-3 text-fx-body text-fx-ink2", className)}>
      <input type="checkbox" role="switch" className="peer sr-only" {...rest} />
      <span
        aria-hidden
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full bg-fx-line2 transition",
          "after:absolute after:top-1 after:left-1 after:size-4 after:rounded-full after:bg-fx-paper after:transition",
          "peer-checked:bg-fx-emphasis peer-checked:after:translate-x-5",
          "peer-focus-visible:ring-3 peer-focus-visible:ring-fx-emphasis-soft peer-disabled:opacity-50",
        )}
      />
      {label}
    </label>
  );
}

export function Checkbox({ label, className, ...rest }: ToggleProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-start gap-3 text-fx-body text-fx-ink2", className)}>
      <input type="checkbox" className="peer sr-only" {...rest} />
      <span
        aria-hidden
        className={cn(
          "mt-px flex size-5 shrink-0 items-center justify-center rounded-[6px] border-2 border-fx-line2 text-transparent transition",
          "peer-checked:border-fx-emphasis peer-checked:bg-fx-emphasis peer-checked:text-fx-emphasis-ink",
          "peer-focus-visible:ring-3 peer-focus-visible:ring-fx-emphasis-soft peer-disabled:opacity-50",
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span>{label}</span>
    </label>
  );
}
