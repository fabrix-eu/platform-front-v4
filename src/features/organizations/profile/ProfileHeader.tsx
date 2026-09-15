import { MapPin } from "lucide-react";
import type { MeOrganization, User } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { orgKindLabel } from "../kinds";
import type { OrganizationProfile } from "../types";
import { ProfileActions } from "./ProfileActions";

interface ProfileHeaderProps {
  org: OrganizationProfile;
  me: User | undefined;
  membership: MeOrganization | undefined;
}

export function ProfileHeader({ org, me, membership }: ProfileHeaderProps) {
  return (
    <section className="overflow-hidden rounded-fx-xl border border-fx-line bg-fx-paper">
      {org.cover_url ? (
        <img src={org.cover_url} alt="" className="h-40 w-full object-cover sm:h-56" />
      ) : (
        <div aria-hidden className="h-40 bg-gradient-to-br from-fx-emphasis-soft via-fx-panel to-fx-teal-soft sm:h-56" />
      )}
      <div className="px-6 pb-7 sm:px-8">
        <Avatar name={org.name} src={org.image_url} size="lg" className="-mt-12 size-24 text-[28px] ring-4 ring-fx-paper" />
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Eyebrow>{orgKindLabel(org.kind)}</Eyebrow>
              {membership && <Badge tone="violet">Your organisation</Badge>}
              {!org.claimed && <Badge tone="amber">Unclaimed</Badge>}
            </div>
            <h1 className="mt-2 text-fx-display break-words text-fx-ink">{org.name}</h1>
            {org.address && (
              <p className="mt-3 flex items-start gap-1.5 text-fx-body text-fx-ink2">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-fx-muted" />
                {org.address}
              </p>
            )}
          </div>
          <ProfileActions org={org} me={me} membership={membership} />
        </div>
      </div>
    </section>
  );
}
