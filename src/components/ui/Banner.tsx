import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BannerTone = "warning" | "info" | "danger" | "success";

const TONES: Record<BannerTone, { box: string; label: string }> = {
  warning: { box: "bg-fx-amber-soft", label: "text-fx-amber" },
  info: { box: "border-2 border-fx-emphasis bg-fx-paper", label: "text-fx-emphasis" },
  danger: { box: "bg-fx-rose-soft", label: "text-fx-rose" },
  success: { box: "bg-fx-green-soft", label: "text-fx-green" },
};

interface BannerProps {
  tone?: BannerTone;
  /** A short uppercase tag before the message ("Heads up", "Read-only"). */
  label?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Banner({ tone = "info", label, children, action, className }: BannerProps) {
  const t = TONES[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 rounded-fx-lg px-5 py-4 text-fx-ink", t.box, className)}
    >
      {label && <span className={cn("font-fx-display text-fx-label uppercase", t.label)}>{label}</span>}
      <div className="min-w-0 flex-1 text-fx-body">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
