import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  /** Say what to do next — an empty list is the best place to ask for a listing or an invite. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("w-full rounded-fx-lg border-2 border-dashed border-fx-line2 px-6 py-12 text-center", className)}>
      <p className="font-fx-display text-fx-title text-fx-ink">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-sm text-fx-body text-fx-ink2">{description}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
