import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
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

const TILE = "group relative size-24 overflow-hidden rounded-fx border border-fx-line bg-fx-panel";

function RemoveButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="absolute top-1.5 right-1.5 rounded-full bg-fx-paper p-1.5 text-fx-ink shadow-sm ring-1 ring-fx-line transition hover:bg-fx-rose hover:text-fx-on-accent hover:ring-fx-rose disabled:opacity-50"
    >
      <Trash2 className="size-4" />
    </button>
  );
}

export function ListingImagesField({ existing, pending, onPick, onRemoveExisting, onRemovePending, busy }: ListingImagesFieldProps) {
  // One preview URL per file, kept for as long as the file is listed: recreating them
  // on every pick made the thumbnails already on screen reload — they flickered.
  const urls = useRef(new Map<File, string>());
  const previews = useMemo(
    () =>
      pending.map((file) => {
        const url = urls.current.get(file) ?? URL.createObjectURL(file);
        urls.current.set(file, url);
        return { file, url };
      }),
    [pending],
  );

  useEffect(() => {
    const listed = new Set(pending);
    for (const [file, url] of urls.current) {
      if (!listed.has(file)) {
        URL.revokeObjectURL(url);
        urls.current.delete(file);
      }
    }
  }, [pending]);

  // Unmount: nothing is listed any more.
  const store = urls.current;
  useEffect(
    () => () => {
      store.forEach((url) => URL.revokeObjectURL(url));
      store.clear();
    },
    [store],
  );

  return (
    <div>
      <span className={labelClass}>Photos</span>
      <div className="flex flex-wrap gap-3">
        {/* First, so it stays where it is as photos are added. */}
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

        {existing.map((image) => (
          <div key={image.id} className={TILE}>
            <img src={image.image_file_url} alt="" className="size-full object-cover" />
            {onRemoveExisting && <RemoveButton label="Remove this photo" onClick={() => onRemoveExisting(image)} disabled={busy} />}
          </div>
        ))}

        {previews.map(({ file, url }, i) => (
          <div key={url} className={TILE}>
            <img src={url} alt="" className="size-full object-cover" />
            {onRemovePending && <RemoveButton label={`Remove ${file.name}`} onClick={() => onRemovePending(i)} disabled={busy} />}
          </div>
        ))}
      </div>
      <p className="mt-2 text-fx-small text-fx-muted">A photo makes a listing far more likely to be opened. JPG, PNG or WebP.</p>
    </div>
  );
}
