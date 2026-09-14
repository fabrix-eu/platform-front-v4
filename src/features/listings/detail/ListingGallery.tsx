import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ListingImage } from "../types";

export function ListingGallery({ images, title }: { images: ListingImage[]; title: string }) {
  // Ephemeral: which photo is shown large.
  const [active, setActive] = useState(0);
  const sorted = [...images].sort((a, b) => a.position - b.position);
  if (sorted.length === 0) return null;
  const current = sorted[Math.min(active, sorted.length - 1)];

  return (
    <div className="space-y-3">
      <div className="aspect-[16/10] overflow-hidden rounded-fx-lg bg-fx-panel">
        <img src={current.image_file_url} alt={title} className="size-full object-cover" />
      </div>
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
