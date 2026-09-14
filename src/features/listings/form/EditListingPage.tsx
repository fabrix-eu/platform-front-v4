import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCurrentOrg } from "@/lib/activeOrg";
import { useToast } from "@/components/Toast";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { LISTINGS_KEY, listingQueryOptions, removeListingImage, updateListing, uploadListingImages } from "../api";
import type { ListingPayload } from "../types";
import { ListingForm } from "./ListingForm";
import { ListingImagesField } from "./ListingImagesField";

export function EditListingPage() {
  const { id } = useParams({ from: "/_auth/marketplace/$id/edit" });
  const { data: listing } = useSuspenseQuery(listingQueryOptions(id));
  const { me } = useCurrentOrg();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // Ephemeral: photos upload as soon as they are picked.
  const [uploading, setUploading] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: LISTINGS_KEY });
  const mutation = useMutation({ mutationFn: (payload: ListingPayload) => updateListing(id, payload) });
  const removeImage = useMutation({ mutationFn: (imageId: string) => removeListingImage(id, imageId), onSuccess: refresh });

  const addImages = async (files: File[]) => {
    setUploading(true);
    const failed = await uploadListingImages(id, files);
    setUploading(false);
    await refresh();
    if (failed > 0) toast(`${failed} photo${failed > 1 ? "s" : ""} could not be uploaded.`, "error");
  };

  const back = () => navigate({ to: "/marketplace/$id", params: { id } });

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow={listing.organization.name} title="Edit listing" lede={listing.title} />
      <Card className="mt-10 p-6 sm:p-8">
        <ListingForm
          mutation={mutation}
          listing={listing}
          organizations={me.organizations}
          busy={uploading}
          submitLabel="Save changes"
          onCancel={back}
          images={
            <ListingImagesField
              existing={listing.images ?? []}
              pending={[]}
              onPick={addImages}
              onRemoveExisting={(image) => removeImage.mutate(image.id)}
              busy={uploading || removeImage.isPending}
            />
          }
          onSubmit={(payload) =>
            mutation.mutate(payload, {
              onSuccess: () => {
                refresh();
                toast("Changes saved");
                back();
              },
            })
          }
        />
      </Card>
    </div>
  );
}
