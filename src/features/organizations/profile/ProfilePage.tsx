import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { organizationProfileQueryOptions } from "../api";
import { OrgListingsSection } from "./OrgListingsSection";
import { ProfileAside } from "./ProfileAside";
import { ProfileHeader } from "./ProfileHeader";
import { AboutSection, ConnectionsSection, PhotosSection } from "./ProfileSections";

// The public face of an organisation: what a partner lands on from a listing, the
// directory, or an invitation to claim it. Open to visitors.
export function ProfilePage() {
  const { id } = useParams({ from: "/_open/organizations/$id" });
  const { data: org } = useSuspenseQuery(organizationProfileQueryOptions(id));
  const me = useOptionalMe();
  const membership = me?.organizations.find((o) => o.organization_id === org.id);

  return (
    <>
      <ProfileHeader org={org} me={me} membership={membership} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          <AboutSection org={org} />
          <OrgListingsSection org={org} isMember={!!membership} />
          <PhotosSection photos={org.organization_photos} />
          <ConnectionsSection org={org} />
        </div>
        <ProfileAside org={org} />
      </div>
    </>
  );
}

export function OrganizationNotFound() {
  return (
    <EmptyState
      title="This organisation is not on FABRIX"
      description="The link may be wrong, or the profile was removed."
      action={<ButtonLink to="/marketplace">Browse the marketplace</ButtonLink>}
    />
  );
}
