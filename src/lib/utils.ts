import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge cannot read our @theme. Without this, `text-fx-body` (a size)
// and `text-fx-ink` (a colour) both look like text colours and one is dropped.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["fx-hero", "fx-display", "fx-title", "fx-heading", "fx-lead", "fx-body", "fx-small", "fx-label"] },
      ],
      "font-family": [{ font: ["fx-display", "fx-text"] }],
      rounded: [{ rounded: ["fx-sm", "fx", "fx-lg", "fx-xl", "fx-action"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "").slice(0, 2);
  return letters.toUpperCase();
}
