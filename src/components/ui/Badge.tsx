import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "green" | "amber" | "teal" | "rose" | "indigo" | "violet" | "slate" | "orange";

// Soft fill with its own accent as ink; `orange` is the one solid badge (wanted, urgent).
const TONES: Record<BadgeTone, string> = {
  green: "bg-fx-green-soft text-fx-green",
  amber: "bg-fx-amber-soft text-fx-amber",
  teal: "bg-fx-teal-soft text-fx-teal",
  rose: "bg-fx-rose-soft text-fx-rose",
  indigo: "bg-fx-indigo-soft text-fx-indigo",
  violet: "bg-fx-emphasis-soft text-fx-emphasis",
  slate: "bg-fx-slate-soft text-fx-ink2",
  orange: "bg-fx-orange text-fx-on-accent",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone };

export function Badge({ tone = "slate", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-fx-sm px-2.5 py-1 font-fx-display text-fx-label uppercase",
        TONES[tone],
        className,
      )}
      {...rest}
    />
  );
}
