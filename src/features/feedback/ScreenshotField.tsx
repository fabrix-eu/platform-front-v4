import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { labelClass } from "@/components/Field";

/** Uncontrolled like every other field — the file lives on the input, and the parent reads
 *  it back with `fd.get("screenshot")`. The preview is the only state, and it is ephemeral. */
export function ScreenshotField() {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // An object URL is a live handle into the document: it has to be handed back.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function pick(file: File | undefined) {
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  function clear() {
    if (input.current) input.current.value = "";
    pick(undefined);
  }

  return (
    <div>
      <label htmlFor="screenshot" className={labelClass}>
        Screenshot
      </label>

      <input
        ref={input}
        id="screenshot"
        name="screenshot"
        type="file"
        accept="image/*"
        onChange={(e) => pick(e.target.files?.[0])}
        className="sr-only"
      />

      {preview ? (
        <div className="relative w-fit">
          <img src={preview} alt="The screenshot you attached" className="max-h-32 rounded-fx border border-fx-line" />
          <button
            type="button"
            onClick={clear}
            aria-label="Remove the screenshot"
            className="absolute -top-2 -right-2 rounded-full border border-fx-line bg-fx-paper p-1 text-fx-muted shadow-sm hover:text-fx-ink"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="screenshot"
          className="flex w-fit cursor-pointer items-center gap-2 rounded-fx border border-dashed border-fx-line2 px-3 py-2 text-fx-small text-fx-ink2 hover:border-fx-emphasis hover:text-fx-ink"
        >
          <ImagePlus className="size-4" />
          Attach an image
        </label>
      )}
    </div>
  );
}
