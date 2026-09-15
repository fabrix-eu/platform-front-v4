import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useCurrentOrg } from "@/lib/activeOrg";
import { Banner } from "@/components/ui/Banner";
import { pendingActionsQueryOptions } from "./api";

// Everything waiting on someone — you, an owner, or the FABRIX team. Hidden when empty.
export function PendingActionsBanner() {
  const { me } = useCurrentOrg();
  const owned = me.organizations.filter((o) => o.role === "owner");
  const { data } = useQuery(pendingActionsQueryOptions(owned));
  if (!data) return null;

  const items: [string, ReactNode][] = [
    ...data.incoming.map(({ org, count }): [string, ReactNode] => [
      `incoming-${org.organization_id}`,
      <Link
        to="/$orgSlug/settings/members"
        params={{ orgSlug: org.organization_slug }}
        className="font-bold underline-offset-4 hover:underline"
      >
        {count === 1 ? `1 person wants to join ${org.organization_name}` : `${count} people want to join ${org.organization_name}`} →
      </Link>,
    ]),
    ...data.invitations.map((i): [string, ReactNode] => [
      `invitation-${i.id}`,
      i.invitation_type === "claim" ? `You're invited to claim ${i.organization.name} — the link is in your email` : `You're invited to join ${i.organization.name} — the link is in your email`,
    ]),
    ...data.claims.map((c): [string, ReactNode] => [`claim-${c.id}`, `Your claim for ${c.organization.name} is being reviewed by the FABRIX team`]),
    ...data.requests.map((r): [string, ReactNode] => [`request-${r.id}`, `Your request to join ${r.organization.name} is waiting for its owners`]),
  ];
  if (items.length === 0) return null;

  const total = data.incoming.reduce((sum, e) => sum + e.count, 0) + data.invitations.length + data.claims.length + data.requests.length;

  return (
    <Banner tone="warning" label={total === 1 ? "1 pending" : `${total} pending`}>
      <ul className="space-y-1">
        {items.map(([key, node]) => (
          <li key={key}>{node}</li>
        ))}
      </ul>
    </Banner>
  );
}
