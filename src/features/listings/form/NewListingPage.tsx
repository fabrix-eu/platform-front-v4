import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useCurrentOrg } from "@/lib/activeOrg";
import { useToast } from "@/components/Toast";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { createListing, LISTINGS_KEY, uploadListingImages } from "../api";
import { ListingForm } from "./ListingForm";
import { ListingImagesField } from "./ListingImagesField";

export function NewListingPage() {
  const { me, currentOrg } = useCurrentOrg();
  const { type } = useSearch({ from: "/_auth/marketplace/new" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // Ephemeral: photos picked before the listing exists, and the upload in progress.
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const mutation = useMutation({ mutationFn: createListing });

  if (!currentOrg) {
    return (
      <>
        <PageHeader title="Add a listing" />
        <EmptyState
          className="mt-10"
          title="Add your organisation first"
          description="Listings are posted by organisations, so partners know who they will work with."
          action={
            <ButtonLink to="/organizations/new">
              <Plus className="size-4" strokeWidth={2.6} />
              Add your organisation
            </ButtonLink>
          }
        />
      </>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow={currentOrg.organization_name}
        title="Add a listing"
        lede="Say what you offer or look for. Organisations nearby find it in the marketplace and contact you."
      />
      <Card className="mt-10 p-6 sm:p-8">
        <ListingForm
          mutation={mutation}
          organizations={me.organizations}
          defaultOrganizationId={currentOrg.organization_id}
          defaultType={type}
          busy={uploading}
          submitLabel="Publish listing"
          onCancel={() => navigate({ to: "/marketplace" })}
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
                queryClient.invalidateQueries({ queryKey: LISTINGS_KEY });
                toast("Listing published");
                navigate({ to: "/marketplace/$id", params: { id: listing.id } });
              },
            })
          }
        />
      </Card>
    </div>
  );
}
