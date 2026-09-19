import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LightboxImage {
  url: string;
  alt?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  /** Which one opens first. */
  startAt?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONTROL =
  "flex size-10 items-center justify-center rounded-full bg-fx-ink/60 text-fx-paper backdrop-blur transition hover:bg-fx-ink/80 " +
  "focus-visible:ring-3 focus-visible:ring-fx-paper/40 focus-visible:outline-none disabled:opacity-0";

/**
 * Looking at a picture, in the page. Opening it in a new tab hands the reader to the
 * browser's own image view — a different background, no way back but the tab bar, and
 * the rest of the list gone.
 *
 * Takes a set rather than a single image, so a strip of thumbnails opens where it was
 * clicked and moves on from there.
 */
export function Lightbox({ images, startAt = 0, open, onOpenChange }: LightboxProps) {
  const [index, setIndex] = useState(startAt);

  // Opening on a different thumbnail than last time has to start there.
  useEffect(() => {
    if (open) setIndex(startAt);
  }, [open, startAt]);

  const total = images.length;
  const current = images[Math.min(index, Math.max(total - 1, 0))];

  useEffect(() => {
    if (!open || total < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % total);
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, total]);

  if (!current) return null;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-fx-ink/80 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 focus:outline-none sm:p-8"
        >
          {/* Radix wants a title; the picture is the content, so it stays for readers only. */}
          <Dialog.Title className="sr-only">{current.alt ?? "Image"}</Dialog.Title>

          <img
            src={current.url}
            alt={current.alt ?? ""}
            className="max-h-[85vh] max-w-full rounded-fx object-contain shadow-2xl"
          />

          {total > 1 && (
            <p className="mt-4 font-fx-display text-fx-label text-fx-paper/80 uppercase">
              {index + 1} of {total}
            </p>
          )}

          <Dialog.Close className={cn(CONTROL, "absolute top-4 right-4")} aria-label="Close">
            <X aria-hidden className="size-5" />
          </Dialog.Close>

          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => setIndex((i) => (i - 1 + total) % total)}
                className={cn(CONTROL, "absolute top-1/2 left-4 -translate-y-1/2")}
              >
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setIndex((i) => (i + 1) % total)}
                className={cn(CONTROL, "absolute top-1/2 right-4 -translate-y-1/2")}
              >
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
