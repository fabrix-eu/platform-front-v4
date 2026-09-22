import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MeOrganization } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { createListing, LISTINGS_KEY, uploadListingImages } from "../api";
import type { Direction } from "../directions";
import { ListingForm } from "./ListingForm";
import { ListingImagesField } from "./ListingImagesField";

const FORM_ID = "new-listing-form";

interface NewListingDialogProps {
  organizationId: string;
  organizations: MeOrganization[];
  /**
   * Which side of the exchange this dialog posts. Section D of the profile opens it
   * once per side, so the form does not ask again; the marketplace leaves it out and
   * the form keeps its offered/wanted question.
   */
  direction?: Direction;
  /** The button that opens it. */
  trigger: ReactNode;
}

// The dialog says back what the button promised — a need that announced itself as an
// offer on the next screen would read as the wrong form having opened.
const COPY = {
  offering: {
    title: "Add an offer",
    description: "It goes on the Marketplace, where organisations nearby find it and contact you.",
    submit: "Publish offer",
    done: "Offer published",
  },
  needing: {
    title: "Add a need",
    description: "It goes on the Marketplace as wanted, where organisations who have it can find you.",
    submit: "Publish need",
    done: "Need published",
  },
  unset: {
    title: "Add an offer",
    description: "It goes on the Marketplace, where organisations nearby find it and contact you.",
    submit: "Publish listing",
    done: "Listing published",
  },
} as const;

/**
 * Posting a listing without leaving the page — used from the profile editor, where
 * offers are part of the section. The marketplace keeps its own page (`/marketplace/new`).
 */
export function NewListingDialog({ organizationId, organizations, direction, trigger }: NewListingDialogProps) {
  const copy = COPY[direction ?? "unset"];
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
        title={copy.title}
        description={copy.description}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            {/* Outside the form, so it stays in view: `form` connects it back. */}
            <Button type="submit" form={FORM_ID} disabled={mutation.isPending || uploading}>
              {mutation.isPending || uploading ? "Saving…" : copy.submit}
            </Button>
          </div>
        }
      >
        <ListingForm
          id={FORM_ID}
          hideActions
          mutation={mutation}
          organizations={organizations}
          defaultOrganizationId={organizationId}
          busy={uploading}
          direction={direction}
          submitLabel={copy.submit}
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
                toast(copy.done);
                close();
              },
            })
          }
        />
      </DialogContent>
    </Dialog>
  );
}
