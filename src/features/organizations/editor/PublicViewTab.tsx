import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { Banner } from "@/components/ui/Banner";
import { ProfileHeader } from "../profile/ProfileHeader";
import { ProfileBody } from "../profile/ProfilePage";
import type { OrganizationProfile } from "../types";

// The profile as another member sees it — the same components as the public page,
// with the viewer's own actions shown but inert.
export function PublicViewTab({ org, orgSlug }: { org: OrganizationProfile; orgSlug: string }) {
  return (
    <div className="space-y-6">
      <Banner
        tone="info"
        action={
          <Link to="/$orgSlug/profile" params={{ orgSlug }} search={{}} className="text-fx-small font-bold text-fx-emphasis underline underline-offset-4">
            Back to editing
          </Link>
        }
      >
        <span className="flex items-center gap-2 font-bold text-fx-emphasis">
          <Eye aria-hidden className="size-4" />
          This is your record as others see it.
        </span>
      </Banner>
      <ProfileHeader org={org} me={undefined} membership={undefined} preview />
      <ProfileBody org={org} isMember={false} />
    </div>
  );
}
