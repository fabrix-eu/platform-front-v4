import { MessageSquare, Pencil, Plus } from "lucide-react";
import type { MeOrganization, User } from "@/lib/auth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ContactOrganizationDialog } from "@/features/messages/ContactOrganizationDialog";
import type { OrganizationProfile } from "../types";
import { ClaimDialog } from "./ClaimDialog";
import { ConnectDialog } from "./ConnectDialog";
import { JoinRequestDialog } from "./JoinRequestDialog";

interface ProfileActionsProps {
  org: OrganizationProfile;
  me: User | undefined;
  membership: MeOrganization | undefined;
}

// What the profile asks of whoever is looking: its team manages it, a visitor signs in,
// another member connects, writes, or asks to join / claims it.
export function ProfileActions({ org, me, membership }: ProfileActionsProps) {
  if (membership) {
    return (
      <div className="flex flex-wrap gap-3">
        <ButtonLink to="/$orgSlug/profile" params={{ orgSlug: membership.organization_slug }} variant="outline">
          <Pencil className="size-4" />
          Edit profile
        </ButtonLink>
        <ButtonLink to="/marketplace/new">
          <Plus className="size-4" strokeWidth={2.6} />
          Add a listing
        </ButtonLink>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="flex flex-wrap gap-3">
        <ButtonLink to="/login">Sign in to connect</ButtonLink>
        <ButtonLink to="/register" variant="ghost">
          Join FABRIX
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {me.organizations.length > 0 && <ConnectDialog org={org} me={me} />}
      {org.claimed && (
        <ContactOrganizationDialog
          organization={org}
          me={me}
          trigger={
            <Button variant="outline">
              <MessageSquare className="size-4" />
              Message
            </Button>
          }
        />
      )}
      {org.claimed ? <JoinRequestDialog org={org} /> : <ClaimDialog org={org} />}
    </div>
  );
}
