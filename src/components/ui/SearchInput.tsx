import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Uncontrolled search box. In a list, debounce it into the `search` URL param. */
export function SearchInput({ className, ...rest }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-fx-muted" />
      <input type="search" className={cn(inputClass, "pl-10")} {...rest} />
    </div>
  );
}
