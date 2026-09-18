import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const TD = "px-3 py-3 align-middle";

const TH = "whitespace-nowrap px-3 py-2.5 text-left font-fx-display text-fx-label text-fx-muted uppercase";

export function AdminTable({ head, children, busy }: { head: ReactNode; children: ReactNode; busy?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-fx-lg border border-fx-line bg-fx-paper" aria-busy={busy}>
      <table className="w-full min-w-3xl border-collapse text-fx-small">
        <thead>
          <tr className="border-b border-fx-line bg-fx-panel">{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/** A column that does not sort — a heading and nothing more. */
export function Column({ label, align }: { label: string; align?: "right" }) {
  return (
    <th scope="col" className={cn(TH, align === "right" && "text-right")}>
      {label}
    </th>
  );
}

interface SortableProps {
  label: string;
  /** The column name the API knows — it is checked against an allowlist server-side. */
  field: string;
  current?: string;
  direction?: "asc" | "desc";
  onSort: (field: string, direction: "asc" | "desc") => void;
  align?: "right";
}

/**
 * Sorting happens in the query, not in the page. Clicking a header asks the API for
 * the whole list in that order: sorting the thirty rows already loaded would answer
 * "first by name" with the first of the page, which is true of nothing.
 */
export function SortableColumn({ label, field, current, direction, onSort, align }: SortableProps) {
  const active = current === field;
  const next = active && direction === "asc" ? "desc" : "asc";
  const Icon = !active ? ChevronsUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <th
      scope="col"
      className={cn(TH, align === "right" && "text-right")}
      aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(field, next)}
        className={cn(
          "inline-flex items-center gap-1.5 uppercase transition hover:text-fx-ink",
          align === "right" && "flex-row-reverse",
          active && "text-fx-ink",
        )}
      >
        {label}
        <Icon aria-hidden className={cn("size-3.5", active ? "text-fx-emphasis" : "text-fx-line2")} strokeWidth={2.5} />
      </button>
    </th>
  );
}
