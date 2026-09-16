import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MeOrganization } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Banner } from "@/components/ui/Banner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { LISTINGS_KEY, listingQueryOptions, removeListingImage, updateListing, uploadListingImages } from "../api";
import type { ListingPayload } from "../types";
import { ListingForm } from "./ListingForm";
import { ListingImagesField } from "./ListingImagesField";

interface EditListingDialogProps {
  listingId: string;
  organizations: MeOrganization[];
  /** The button that opens it. */
  trigger: ReactNode;
}

/** Editing a listing in place. The full listing (with its photos) loads when it opens. */
export function EditListingDialog({ listingId, organizations, trigger }: EditListingDialogProps) {
  // Ephemeral: the dialog and the photo upload in progress.
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({ ...listingQueryOptions(listingId), enabled: open });
  const refresh = () => queryClient.invalidateQueries({ queryKey: LISTINGS_KEY });
  const mutation = useMutation({ mutationFn: (payload: ListingPayload) => updateListing(listingId, payload) });
  const removeImage = useMutation({ mutationFn: (imageId: string) => removeListingImage(listingId, imageId), onSuccess: refresh });

  const close = () => {
    setOpen(false);
    mutation.reset();
  };

  const addImages = async (files: File[]) => {
    setUploading(true);
    const failed = await uploadListingImages(listingId, files);
    setUploading(false);
    await refresh();
    if (failed > 0) toast(`${failed} photo${failed > 1 ? "s" : ""} could not be uploaded.`, "error");
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl" title="Edit listing" description={query.data?.title}>
        {query.isPending ? (
          <p className="text-fx-small text-fx-muted">Loading…</p>
        ) : query.isError ? (
          <Banner tone="danger">This listing could not be loaded. Try again in a moment.</Banner>
        ) : (
          <ListingForm
            mutation={mutation}
            listing={query.data}
            organizations={organizations}
            busy={uploading}
            submitLabel="Save changes"
            onCancel={close}
            images={
              <ListingImagesField
                existing={query.data.images ?? []}
                pending={[]}
                onPick={addImages}
                onRemoveExisting={(image) => removeImage.mutate(image.id)}
                busy={uploading || removeImage.isPending}
              />
            }
            onSubmit={(payload) =>
              mutation.mutate(payload, {
                onSuccess: async () => {
                  await refresh();
                  toast("Changes saved");
                  close();
                },
              })
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
