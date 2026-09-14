import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type CardTone = "paper" | "emphasis" | "soft";

// `emphasis` is the surface the prototype never had: a solid brand block, for a
// number or a call to action that must read before anything else on the page.
const TONES: Record<CardTone, string> = {
  paper: "border border-fx-line bg-fx-paper text-fx-ink",
  emphasis: "bg-fx-emphasis text-fx-emphasis-ink",
  soft: "bg-fx-emphasis-soft text-fx-ink",
};

type CardProps = HTMLAttributes<HTMLDivElement> & { tone?: CardTone };

export function Card({ tone = "paper", className, ...rest }: CardProps) {
  return <div className={cn("rounded-fx-lg p-5", TONES[tone], className)} {...rest} />;
}
