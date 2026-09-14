import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** The small uppercase label above a title or a group ("Get started", "This month"). */
export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("font-fx-display text-fx-label text-fx-muted uppercase", className)} {...rest} />;
}
