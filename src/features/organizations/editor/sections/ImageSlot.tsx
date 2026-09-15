import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
import { labelClass } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Button, buttonClass } from "@/components/ui/Button";
import { uploadFile } from "@/lib/upload";
import { cn } from "@/lib/utils";
import { updateOrganization } from "../../api";
import type { OrganizationProfile } from "../../types";

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";

type SlotField = "image_url" | "cover_url";

const SLOTS: Record<SlotField, { label: string; hint: string; frame: string }> = {
  image_url: {
    label: "Logo",
    hint: "Square works best — it sits next to your name in the Directory and on the Marketplace.",
    frame: "size-24",
  },
  cover_url: {
    label: "Banner",
    hint: "A wide, landscape photo across the top of your profile.",
    frame: "aspect-[3/1] w-full max-w-sm",
  },
};

/** Logo or banner: uploads straight to the bucket, then saves the URL on the organisation. */
export function ImageSlot({ org, field }: { org: OrganizationProfile; field: SlotField }) {
  const slot = SLOTS[field];
  const current = org[field];
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async (file: File | null) => {
      const url = file ? await uploadFile(file, "Organization", org.id) : null;
      return updateOrganization(org.id, field === "image_url" ? { image_url: url } : { cover_url: url });
    },
    onSuccess: async (_data, file) => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
      // The logo also shows in the org switcher.
      if (field === "image_url") await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast(file ? `${slot.label} updated` : `${slot.label} removed`);
    },
  });

  return (
    <div>
      <span className={labelClass}>{slot.label}</span>
      <div className="flex flex-wrap items-center gap-4">
        <div className={cn("shrink-0 overflow-hidden rounded-fx border border-fx-line bg-fx-panel", slot.frame)}>
          {current ? (
            <img src={current} alt={`Current ${slot.label.toLowerCase()}`} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-fx-muted">
              <ImagePlus aria-hidden className="size-5" />
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label
            className={buttonClass({
              variant: "secondary",
              size: "sm",
              className: "cursor-pointer has-[:disabled]:cursor-wait has-[:disabled]:opacity-60",
            })}
          >
            {mutation.isPending ? "Uploading…" : current ? `Replace ${slot.label.toLowerCase()}` : `Upload ${slot.label.toLowerCase()}`}
            <input
              type="file"
              accept={IMAGE_ACCEPT}
              disabled={mutation.isPending}
              className="sr-only"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                if (file) mutation.mutate(file);
              }}
            />
          </label>
          {current && (
            <Button
              variant="ghost"
              size="sm"
              disabled={mutation.isPending}
              onClick={() => {
                if (window.confirm(`Remove the ${slot.label.toLowerCase()}?`)) mutation.mutate(null);
              }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
      <p className="mt-2 text-fx-small text-fx-muted">{slot.hint}</p>
      <FormError mutation={mutation} fields={[field]} />
    </div>
  );
}
