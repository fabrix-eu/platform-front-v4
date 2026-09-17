import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { BadgeTone } from "./Badge";

// Selected is a solid fill, not a tint: at 12px a tint is the difference between
// "this filter is on" and "did I click that?".
const BASE =
  "group inline-flex items-center gap-1.5 rounded-full border border-fx-line2 bg-fx-paper px-4 py-2 font-fx-text " +
  "text-fx-small font-bold text-fx-ink2 transition hover:border-fx-emphasis";

// A toned pill keeps that solid fill and only swaps its colour, so a value-chain
// filter carries its own hue in both states: the dot while off, the whole pill once
// on. One custom property drives both, which keeps the classes static for Tailwind.
const TONE_VARS: Record<BadgeTone, string> = {
  green: "var(--color-fx-green)",
  amber: "var(--color-fx-amber)",
  teal: "var(--color-fx-teal)",
  rose: "var(--color-fx-rose)",
  indigo: "var(--color-fx-indigo)",
  violet: "var(--color-fx-emphasis)",
  slate: "var(--color-fx-ink2)",
  orange: "var(--color-fx-orange)",
};

const TONE_ON = "border-[var(--pill-tone)] bg-[var(--pill-tone)] text-fx-on-accent";
const EMPHASIS_ON = "border-fx-emphasis bg-fx-emphasis text-fx-emphasis-ink";

const toneStyle = (tone?: BadgeTone) => (tone ? ({ "--pill-tone": TONE_VARS[tone] } as CSSProperties) : undefined);

/** The tone's dot, which inverts once the pill itself is filled with that tone. */
function ToneDot() {
  return (
    <span
      aria-hidden
      className="size-2 shrink-0 rounded-full bg-[var(--pill-tone)] transition group-aria-pressed:bg-fx-on-accent group-data-[status=active]:bg-fx-on-accent"
    />
  );
}

type PillProps = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; tone?: BadgeTone };

/** A toggle pill inside a form (e.g. multi-select specialties). */
export function Pill({ selected, tone, className, type = "button", children, ...rest }: PillProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      style={toneStyle(tone)}
      className={cn(BASE, selected && (tone ? TONE_ON : EMPHASIS_ON), className)}
      {...rest}
    >
      {tone && <ToneDot />}
      {children}
    </button>
  );
}

type PillAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Overrides the router's active detection (e.g. when only one search param differs). */
  active?: boolean;
  tone?: BadgeTone;
  "data-status"?: string;
};

const PillAnchor = forwardRef<HTMLAnchorElement, PillAnchorProps>(({ active, tone, className, children, ...rest }, ref) => {
  const status = active === undefined ? rest["data-status"] : active ? "active" : undefined;
  return (
    <a
      ref={ref}
      {...rest}
      data-status={status}
      aria-current={status === "active" ? "true" : undefined}
      style={toneStyle(tone)}
      className={cn(
        BASE,
        "data-[status=active]:border-fx-emphasis data-[status=active]:bg-fx-emphasis data-[status=active]:text-fx-emphasis-ink",
        tone &&
          "data-[status=active]:border-[var(--pill-tone)] data-[status=active]:bg-[var(--pill-tone)] data-[status=active]:text-fx-on-accent",
        className,
      )}
    >
      {tone && <ToneDot />}
      {children}
    </a>
  );
});
PillAnchor.displayName = "PillAnchor";

const CreatedPillLink = createLink(PillAnchor);

/** A filter pill that writes to the URL — view state lives in search params. */
export const PillLink: LinkComponent<typeof PillAnchor> = (props) => <CreatedPillLink {...props} />;
