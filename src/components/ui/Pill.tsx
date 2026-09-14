import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// Selected is a solid fill, not a tint: at 12px a tint is the difference between
// "this filter is on" and "did I click that?".
const BASE =
  "inline-flex items-center gap-1.5 rounded-full border border-fx-line2 bg-fx-paper px-4 py-2 font-fx-text " +
  "text-fx-small font-bold text-fx-ink2 transition hover:border-fx-emphasis";

type PillProps = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean };

/** A toggle pill inside a form (e.g. multi-select specialties). */
export function Pill({ selected, className, type = "button", ...rest }: PillProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(BASE, selected && "border-fx-emphasis bg-fx-emphasis text-fx-emphasis-ink", className)}
      {...rest}
    />
  );
}

type PillAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Overrides the router's active detection (e.g. when only one search param differs). */
  active?: boolean;
  "data-status"?: string;
};

const PillAnchor = forwardRef<HTMLAnchorElement, PillAnchorProps>(({ active, className, ...rest }, ref) => {
  const status = active === undefined ? rest["data-status"] : active ? "active" : undefined;
  return (
    <a
      ref={ref}
      {...rest}
      data-status={status}
      aria-current={status === "active" ? "true" : undefined}
      className={cn(
        BASE,
        "data-[status=active]:border-fx-emphasis data-[status=active]:bg-fx-emphasis data-[status=active]:text-fx-emphasis-ink",
        className,
      )}
    />
  );
});
PillAnchor.displayName = "PillAnchor";

const CreatedPillLink = createLink(PillAnchor);

/** A filter pill that writes to the URL — view state lives in search params. */
export const PillLink: LinkComponent<typeof PillAnchor> = (props) => <CreatedPillLink {...props} />;
