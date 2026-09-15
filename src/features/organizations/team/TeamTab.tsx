import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { useCurrentOrg } from "@/lib/activeOrg";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import type { OrganizationProfile } from "../types";
import { roleLabel, teamInvitationsQueryOptions, teamMembersQueryOptions } from "./api";
import { InviteColleagueDialog } from "./InviteColleagueDialog";
import { RolesPanel } from "./RolesPanel";

const daysAgo = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
};

const ROW = "flex flex-wrap items-center gap-3 border-t border-fx-line px-4 py-3.5 first:border-t-0 sm:px-5";

export function TeamTab({ org }: { org: OrganizationProfile }) {
  const { me } = useCurrentOrg();
  const isOwner = me.organizations.find((o) => o.organization_id === org.id)?.role === "owner";
  const members = useQuery(teamMembersQueryOptions(org.id));
  // Only owners may list and send invitations.
  const invitations = useQuery({ ...teamInvitationsQueryOptions(org.id), enabled: isOwner });
  const pending = (invitations.data ?? []).filter((i) => !i.expired);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-fx-body text-fx-ink2">
          The people who can act for {org.name}. Adding colleagues means the profile is not tied to one person.
        </p>
        {isOwner && <InviteColleagueDialog organizationId={org.id} organizationName={org.name} />}
      </div>

      {members.isError ? (
        <Banner tone="danger">The team could not be loaded. Try again in a moment.</Banner>
      ) : (
        <Card className="p-0" aria-busy={members.isPending}>
          <ul>
            {members.isPending && <li className={ROW}><span className="text-fx-small text-fx-muted">Loading the team…</span></li>}
            {members.data?.map((m) => (
              <li key={m.id} className={ROW}>
                <Avatar name={m.user.name} src={m.user.image_url} kind="person" size="sm" />
                <span className="min-w-0 flex-1 text-fx-body">
                  <span className="font-bold text-fx-ink">{m.user.name}</span>
                  <span className="text-fx-muted"> · {m.user.email}{m.user.id === me.id && " · you"}</span>
                </span>
                <Badge tone={m.role === "owner" ? "violet" : "slate"}>{roleLabel(m.role)}</Badge>
              </li>
            ))}
            {pending.map((i) => (
              <li key={i.id} className={ROW}>
                <span aria-hidden className="flex size-8 items-center justify-center rounded-full bg-fx-amber-soft font-fx-display text-fx-small font-extrabold text-fx-amber">?</span>
                <span className="min-w-0 flex-1 text-fx-body">
                  <span className="font-bold text-fx-ink">{i.email}</span>
                  <span className="text-fx-muted"> · invitation sent {daysAgo(i.created_at)}</span>
                </span>
                <Badge tone="amber">Pending · {roleLabel(i.role)}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <RolesPanel />
      <p className="flex items-start gap-2 text-fx-small text-fx-muted">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        People act under the organisation, not as themselves — so the profile and its history stay intact if someone leaves.
      </p>
    </div>
  );
}
