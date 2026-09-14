import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

interface PageHeaderProps {
  /** Context above the title — usually the organisation the page is about. */
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  /** The page's main action ("Add a listing") goes here, top right. */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, lede, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-wrap items-end justify-between gap-x-8 gap-y-4", className)}>
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <Eyebrow className="mb-3 truncate">{eyebrow}</Eyebrow>}
        <h1 className="text-fx-display text-fx-ink">{title}</h1>
        {lede && <p className="mt-3 text-fx-lead text-fx-ink2">{lede}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
