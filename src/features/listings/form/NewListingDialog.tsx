import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MeOrganization } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { createListing, LISTINGS_KEY, uploadListingImages } from "../api";
import { ListingForm } from "./ListingForm";
import { ListingImagesField } from "./ListingImagesField";

interface NewListingDialogProps {
  organizationId: string;
  organizations: MeOrganization[];
  /** The button that opens it. */
  trigger: ReactNode;
}

/**
 * Posting a listing without leaving the page — used from the profile editor, where
 * offers are part of the section. The marketplace keeps its own page (`/marketplace/new`).
 */
export function NewListingDialog({ organizationId, organizations, trigger }: NewListingDialogProps) {
  // Ephemeral: the dialog, the photos picked before the listing exists, the upload.
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({ mutationFn: createListing });

  const close = () => {
    setOpen(false);
    setFiles([]);
    mutation.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-2xl"
        title="Add an offer"
        description="It goes on the Marketplace, where organisations nearby find it and contact you."
      >
        <ListingForm
          mutation={mutation}
          organizations={organizations}
          defaultOrganizationId={organizationId}
          busy={uploading}
          submitLabel="Publish listing"
          onCancel={close}
          images={
            <ListingImagesField
              existing={[]}
              pending={files}
              onPick={(picked) => setFiles((prev) => [...prev, ...picked])}
              onRemovePending={(index) => setFiles((prev) => prev.filter((_, i) => i !== index))}
              busy={uploading}
            />
          }
          onSubmit={(payload) =>
            mutation.mutate(payload, {
              onSuccess: async (listing) => {
                if (files.length > 0) {
                  setUploading(true);
                  const failed = await uploadListingImages(listing.id, files);
                  setUploading(false);
                  if (failed > 0) toast(`${failed} photo${failed > 1 ? "s" : ""} could not be uploaded — add them again from Edit.`, "error");
                }
                await queryClient.invalidateQueries({ queryKey: LISTINGS_KEY });
                toast("Listing published");
                close();
              },
            })
          }
        />
      </DialogContent>
    </Dialog>
  );
}
