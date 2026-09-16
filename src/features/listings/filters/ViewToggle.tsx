import { Link } from "@tanstack/react-router";
import { LayoutGrid, List, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const VIEWS = [
  { key: "cards", label: "Cards", icon: LayoutGrid },
  { key: "list", label: "List", icon: List },
  { key: "map", label: "Map", icon: Map },
] as const;

export function ViewToggle({ view }: { view: "cards" | "list" | "map" }) {
  return (
    <div role="group" aria-label="View" className="flex rounded-fx-action border border-fx-line2 bg-fx-paper p-0.5">
      {VIEWS.map(({ key, label, icon: Icon }) => (
        <Link
          key={key}
          to="/marketplace"
          search={(prev) => ({ ...prev, view: key === "cards" ? undefined : key })}
          replace
          resetScroll={false}
          aria-pressed={view === key}
          className={cn(
            "flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-fx-small font-bold transition",
            view === key ? "bg-fx-emphasis text-fx-emphasis-ink" : "text-fx-ink2 hover:text-fx-ink",
          )}
        >
          <Icon aria-hidden className="size-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}
