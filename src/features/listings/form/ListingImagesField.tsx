import { useEffect, useMemo } from "react";
import { ImagePlus, X } from "lucide-react";
import { labelClass } from "@/components/Field";
import type { ListingImage } from "../types";

interface ListingImagesFieldProps {
  /** Photos already attached (edit). */
  existing: ListingImage[];
  /** Photos picked but not uploaded yet (create: they upload once the listing exists). */
  pending: File[];
  onPick: (files: File[]) => void;
  onRemoveExisting?: (image: ListingImage) => void;
  onRemovePending?: (index: number) => void;
  busy?: boolean;
}

const TILE = "relative size-24 overflow-hidden rounded-fx border border-fx-line bg-fx-panel";

function RemoveButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Remove photo"
      className="absolute top-1.5 right-1.5 rounded-full bg-fx-ink/70 p-1 text-fx-on-accent hover:bg-fx-ink disabled:opacity-50"
    >
      <X className="size-3.5" />
    </button>
  );
}

export function ListingImagesField({ existing, pending, onPick, onRemoveExisting, onRemovePending, busy }: ListingImagesFieldProps) {
  const previews = useMemo(() => pending.map((file) => URL.createObjectURL(file)), [pending]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  return (
    <div>
      <span className={labelClass}>Photos</span>
      <div className="flex flex-wrap gap-3">
        {existing.map((image) => (
          <div key={image.id} className={TILE}>
            <img src={image.image_file_url} alt="" className="size-full object-cover" />
            {onRemoveExisting && <RemoveButton onClick={() => onRemoveExisting(image)} disabled={busy} />}
          </div>
        ))}
        {previews.map((url, i) => (
          <div key={url} className={TILE}>
            <img src={url} alt="" className="size-full object-cover" />
            {onRemovePending && <RemoveButton onClick={() => onRemovePending(i)} disabled={busy} />}
          </div>
        ))}
        <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-fx border-2 border-dashed border-fx-line2 text-fx-small font-bold text-fx-ink2 transition hover:border-fx-emphasis hover:text-fx-emphasis has-[:disabled]:cursor-wait has-[:disabled]:opacity-60">
          <ImagePlus aria-hidden className="size-5" />
          {busy ? "Uploading…" : "Add"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            disabled={busy}
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.currentTarget.files ?? []);
              e.currentTarget.value = "";
              if (files.length > 0) onPick(files);
            }}
          />
        </label>
      </div>
      <p className="mt-2 text-fx-small text-fx-muted">A photo makes a listing far more likely to be opened. JPG, PNG or WebP.</p>
    </div>
  );
}
