import { Globe, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import type { OrganizationProfile } from "../../types";
import { FormGroup } from "./FormGroup";
import { ImageSlot } from "./ImageSlot";
import { PhotoGallery } from "./PhotoGallery";

const publicBadge = (
  <Badge tone="teal">
    <Globe aria-hidden className="size-3" />
    Public
  </Badge>
);

// Photos & media — on existing attributes: the photo gallery, the logo (image_url) and
// the banner (cover_url). Each change saves on its own: there is no form to submit.
// The prototype's video links and documents have no field on the API yet.
export function PhotosMediaForm({ org }: { org: OrganizationProfile }) {
  return (
    <div className="space-y-7">
      <FormGroup
        title="Show what you do"
        description="One good photo of the workshop is worth more than a paragraph. This is the single cheapest thing you can do to look real."
        aside={publicBadge}
      >
        <PhotoGallery org={org} />
        <Banner tone="warning">
          <span className="flex items-start gap-2">
            <Users aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span>
              If your photos show people who work here, make sure they are happy to appear — once this profile is public, so are they. You are
              responsible for that, so it is worth asking first.
            </span>
          </span>
        </Banner>
      </FormGroup>

      <FormGroup title="Logo & banner" description="How you show up in the Directory, on the Marketplace and at the top of your profile." aside={publicBadge}>
        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <ImageSlot org={org} field="image_url" />
          <ImageSlot org={org} field="cover_url" />
        </div>
      </FormGroup>
    </div>
  );
}
