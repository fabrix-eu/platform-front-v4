import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  onChange: (page: number) => void;
}

const STEP = "inline-flex items-center gap-1.5 rounded-fx-action border border-fx-line2 bg-fx-paper px-3 py-2 text-fx-small font-bold text-fx-ink2 transition hover:border-fx-emphasis disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-fx-line2";

/**
 * Page by page, not infinite scroll. An admin list is worked through, not browsed:
 * you want to know where you are, how much there is, and to come back to the same
 * place — which a scroll position cannot promise.
 */
export function Pagination({ page, totalPages, totalCount, onChange }: PaginationProps) {
  if (totalPages <= 1) {
    return <p className="text-fx-small text-fx-muted">{totalCount.toLocaleString()} in total</p>;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-fx-small text-fx-ink2">
        Page <span className="font-bold text-fx-ink">{page}</span> of {totalPages}
        <span className="text-fx-muted"> · {totalCount.toLocaleString()} in total</span>
      </p>

      <div className="flex items-center gap-2">
        <button type="button" className={cn(STEP)} disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft aria-hidden className="size-4" />
          Previous
        </button>
        <button type="button" className={cn(STEP)} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Next
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
