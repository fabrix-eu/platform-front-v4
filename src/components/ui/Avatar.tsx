import { cn, initials } from "@/lib/utils";

export type AvatarKind = "organization" | "person";
export type AvatarSize = "sm" | "md" | "lg";

const SIZES: Record<AvatarSize, string> = {
  sm: "size-8 text-[11px]",
  md: "size-12 text-[15px]",
  lg: "size-16 text-[20px]",
};

// Organisations are squares, people are circles — one rule, no ambiguity.
const ORG_RADIUS: Record<AvatarSize, string> = {
  sm: "rounded-fx-sm",
  md: "rounded-fx",
  lg: "rounded-fx-lg",
};

const TONES = [
  "bg-fx-emphasis text-fx-emphasis-ink",
  "bg-fx-teal text-fx-on-accent",
  "bg-fx-green-soft text-fx-green",
  "bg-fx-rose-soft text-fx-rose",
  "bg-fx-indigo-soft text-fx-indigo",
  "bg-fx-amber-soft text-fx-amber",
];

// Derived from the name, so the same organisation always gets the same colour.
function toneFor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
}

interface AvatarProps {
  name: string;
  src?: string | null;
  kind?: AvatarKind;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, src, kind = "organization", size = "md", className }: AvatarProps) {
  const shape = kind === "person" ? "rounded-full" : ORG_RADIUS[size];

  if (src) {
    return <img src={src} alt={name} className={cn("shrink-0 object-cover", SIZES[size], shape, className)} />;
  }

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "flex shrink-0 items-center justify-center font-fx-display font-extrabold",
        SIZES[size],
        shape,
        toneFor(name),
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
