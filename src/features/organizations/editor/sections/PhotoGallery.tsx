import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import { inputClass } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { uploadFile } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { addOrganizationPhoto, deleteOrganizationPhoto, updateOrganizationPhoto } from "../../photos";
import type { OrganizationPhoto, OrganizationProfile } from "../../types";
import { IMAGE_ACCEPT } from "./ImageSlot";

const PROFILE_KEY = ["organizations", "profile"];

function PhotoTile({ org, photo, onRemove, busy }: { org: OrganizationProfile; photo: OrganizationPhoto; onRemove: () => void; busy: boolean }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const caption = useMutation({
    mutationFn: (value: string | null) => updateOrganizationPhoto(org.id, photo.id, { caption: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      toast("Caption saved");
    },
  });

  return (
    <figure className="overflow-hidden rounded-fx border border-fx-line bg-fx-paper">
      <div className="relative">
        <img src={photo.url} alt={photo.caption ?? ""} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          disabled={busy}
          aria-label="Remove photo"
          className="absolute top-2 right-2 rounded-full bg-fx-ink/70 p-1 text-fx-on-accent hover:bg-fx-ink disabled:opacity-50"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <figcaption className="p-2">
        {/* Saved when the field is left (or on Enter) — only if it changed. */}
        <input
          name="caption"
          aria-label="Caption"
          placeholder="Add a caption"
          defaultValue={photo.caption ?? ""}
          disabled={caption.isPending}
          className={cn(inputClass, "py-1.5 text-fx-small")}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
          onBlur={(e) => {
            const value = e.currentTarget.value.trim();
            if (value !== (photo.caption ?? "")) caption.mutate(value || null);
          }}
        />
        <FormError mutation={caption} fields={["caption"]} />
      </figcaption>
    </figure>
  );
}

/** The organisation's photos: add several at once, caption them, remove them. */
export function PhotoGallery({ org }: { org: OrganizationProfile }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const photos = [...org.organization_photos].sort((a, b) => a.position - b.position);

  const add = useMutation({
    mutationFn: async (files: File[]) => {
      for (const file of files) {
        const url = await uploadFile(file, "Organization", org.id);
        await addOrganizationPhoto(org.id, { url });
      }
    },
    // Refresh even after a failure: the photos uploaded before it are saved.
    onSettled: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
    onSuccess: (_data, files) => toast(files.length === 1 ? "Photo added" : `${files.length} photos added`),
  });
  const remove = useMutation({
    mutationFn: (photo: OrganizationPhoto) => deleteOrganizationPhoto(org.id, photo.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
      toast("Photo removed");
    },
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <PhotoTile
            key={photo.id}
            org={org}
            photo={photo}
            busy={remove.isPending}
            onRemove={() => {
              if (window.confirm("Remove this photo?")) remove.mutate(photo);
            }}
          />
        ))}
        <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-fx border-2 border-dashed border-fx-line2 text-fx-small font-bold text-fx-ink2 transition hover:border-fx-emphasis hover:text-fx-emphasis has-[:disabled]:cursor-wait has-[:disabled]:opacity-60">
          <ImagePlus aria-hidden className="size-5" />
          {add.isPending ? "Uploading…" : "Add photos"}
          <input
            type="file"
            accept={IMAGE_ACCEPT}
            multiple
            disabled={add.isPending}
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.currentTarget.files ?? []);
              e.currentTarget.value = "";
              if (files.length > 0) add.mutate(files);
            }}
          />
        </label>
      </div>
      <p className="mt-2 text-fx-small text-fx-muted">
        {photos.length === 0 ? "No photos yet. " : ""}The workshop, your machines, your work. JPG, PNG or WebP.
      </p>
      <FormError mutation={add} fields={["url"]} />
      <FormError mutation={remove} />
    </div>
  );
}
