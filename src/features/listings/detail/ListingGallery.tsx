import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/Lightbox";
import type { ListingImage } from "../types";

export function ListingGallery({ images, title }: { images: ListingImage[]; title: string }) {
  // Ephemeral: which photo is shown large, and whether it is open full size.
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const sorted = [...images].sort((a, b) => a.position - b.position);
  if (sorted.length === 0) return null;
  const index = Math.min(active, sorted.length - 1);
  const current = sorted[index];

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the photo full size"
        className="block aspect-[16/10] w-full overflow-hidden rounded-fx-lg bg-fx-panel"
      >
        <img src={current.image_file_url} alt={title} className="size-full object-cover transition hover:brightness-95" />
      </button>

      <Lightbox
        images={sorted.map((image) => ({ url: image.image_file_url, alt: title }))}
        startAt={index}
        open={open}
        onOpenChange={setOpen}
      />
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={img.id === current.id}
              className={cn(
                "size-20 shrink-0 overflow-hidden rounded-fx-sm border-2 transition",
                img.id === current.id ? "border-fx-emphasis" : "border-transparent hover:border-fx-line2",
              )}
            >
              <img src={img.image_file_url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
