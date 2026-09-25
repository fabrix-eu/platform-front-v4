import { useState } from "react";
import { Lightbox } from "@/components/ui/Lightbox";

interface FigureProps {
  /** Root-relative, under public/manual/<page>/. */
  src: string;
  alt: string;
  caption?: string;
}

/**
 * A screenshot in a chapter: framed like a window, captioned, and opened full-size in
 * the same lightbox the marketplace uses. The frame says "this is the product", so the
 * picture is never mistaken for the page around it.
 */
export function Figure({ src, alt, caption }: FigureProps) {
  const [open, setOpen] = useState(false);

  return (
    <figure className="mt-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper shadow-sm transition hover:border-fx-line2 focus-visible:ring-3 focus-visible:ring-fx-emphasis-soft focus-visible:outline-none"
        aria-label={`Open the screenshot: ${alt}`}
      >
        <img src={src} alt={alt} loading="lazy" className="block w-full" />
      </button>
      {caption && <figcaption className="mt-2 text-fx-label text-fx-muted">{caption}</figcaption>}
      <Lightbox images={[{ url: src, alt }]} open={open} onOpenChange={setOpen} />
    </figure>
  );
}
