import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SearchInput } from "@/components/ui/SearchInput";

// Uncontrolled, debounced into ?search= — the URL is the only place the term lives.
export function SearchBox({ value }: { value?: string }) {
  const navigate = useNavigate({ from: "/marketplace/" });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <SearchInput
      defaultValue={value}
      placeholder="Search listings"
      aria-label="Search listings"
      onChange={(e) => {
        const term = e.currentTarget.value.trim();
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          navigate({ search: (prev) => ({ ...prev, search: term || undefined }), replace: true, resetScroll: false });
        }, 350);
      }}
    />
  );
}
