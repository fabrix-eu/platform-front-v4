import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

/** An inline link inside a chapter's prose. */
export const proseLink = "font-bold text-fx-ink underline decoration-fx-line2 underline-offset-4 hover:text-fx-emphasis";

/** One numbered step of a tutorial. */
export function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li>
      <Card className="flex gap-4 p-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fx-emphasis-soft font-fx-display text-fx-small font-extrabold text-fx-emphasis">
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-fx-heading text-fx-ink">{title}</h2>
          <div className="mt-1.5 space-y-2 text-fx-body text-fx-ink2">{children}</div>
        </div>
      </Card>
    </li>
  );
}

/** Label + one line, stacked with hairlines: the manual's way of listing facts. */
export function FactList({ rows }: { rows: string[][] }) {
  return (
    <ul className="flex flex-col">
      {rows.map(([label, detail]) => (
        <li key={label} className="border-t border-fx-line py-3 first:border-t-0">
          <p className="text-fx-body font-bold text-fx-ink">{label}</p>
          <p className="mt-0.5 text-fx-small text-fx-ink2">{detail}</p>
        </li>
      ))}
    </ul>
  );
}
