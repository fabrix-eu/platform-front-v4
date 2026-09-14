import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

// The primary reads its fill from `emphasis` and its shape from `radius-fx-action`:
// a button never names violet.
const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-fx-emphasis text-fx-emphasis-ink hover:brightness-110",
  outline: "border-2 border-fx-emphasis bg-fx-paper text-fx-ink hover:bg-fx-emphasis-soft",
  secondary: "border border-fx-line2 bg-fx-paper text-fx-ink2 hover:border-fx-ink hover:text-fx-ink",
  ghost: "text-fx-ink2 hover:bg-fx-panel hover:text-fx-ink",
  danger: "bg-fx-rose text-fx-on-accent hover:brightness-110",
};

const SIZES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-fx-body",
  sm: "px-4 py-1.5 text-fx-small",
};

interface ButtonStyle {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClass({ variant = "primary", size = "md", className }: ButtonStyle = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-fx-action font-fx-text font-bold transition",
    "focus-visible:ring-3 focus-visible:ring-fx-emphasis-soft focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-fx-line disabled:text-fx-muted disabled:brightness-100",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyle;

export function Button({ variant, size, className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...rest} />;
}

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonStyle;

const ButtonAnchor = forwardRef<HTMLAnchorElement, AnchorProps>(({ variant, size, className, ...rest }, ref) => (
  <a ref={ref} className={buttonClass({ variant, size, className })} {...rest} />
));
ButtonAnchor.displayName = "ButtonAnchor";

const CreatedButtonLink = createLink(ButtonAnchor);

/** A router link that looks like a button — for actions that navigate ("Add a listing"). */
export const ButtonLink: LinkComponent<typeof ButtonAnchor> = (props) => (
  <CreatedButtonLink preload="intent" {...props} />
);
