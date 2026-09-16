import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowRight, Plus, X } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { organizationProfileQueryOptions } from "@/features/organizations/api";
import { orgKindLabel } from "@/features/organizations/kinds";
import { deleteRelation, relationLabel } from "@/features/organizations/relations";
import type { OrganizationProfile, OrganizationRelation, OrganizationSummary } from "@/features/organizations/types";
import { AddConnectionDialog } from "./AddConnectionDialog";

type Related = OrganizationSummary & { slug: string };

function ConnectionRow({ org, other, relation }: { org: OrganizationProfile; other: Related; relation: OrganizationRelation }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const outgoing = relation.from_organization_id === org.id;
  const remove = useMutation({
    mutationFn: () => deleteRelation(relation.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
      toast(`${other.name} removed from your connections`);
    },
  });

  return (
    <li className="flex flex-wrap items-center gap-3 border-t border-fx-line px-4 py-3.5 first:border-t-0 sm:px-5">
      <Avatar name={other.name} src={other.image_url} />
      <div className="min-w-0 flex-1 basis-60">
        <Link to="/organizations/$id" params={{ id: other.slug }} preload="intent" className="text-fx-body font-bold text-fx-ink hover:text-fx-emphasis">
          {other.name}
        </Link>
        <p className="truncate text-fx-small text-fx-muted">{[orgKindLabel(other.kind), other.address].filter(Boolean).join(" · ")}</p>
        {relation.description && <p className="mt-1 text-fx-small text-fx-ink2">{relation.description}</p>}
      </div>
      <span className="flex items-center gap-2">
        <Badge tone="violet">{relationLabel(relation.relation_type)}</Badge>
        <span className="flex items-center gap-1 text-fx-small text-fx-muted" title={outgoing ? `${org.name} → ${other.name}` : `${other.name} → ${org.name}`}>
          {outgoing ? "you" : "them"}
          <ArrowRight aria-hidden className="size-3.5" />
          {outgoing ? "them" : "you"}
        </span>
      </span>
      {!other.claimed && <Badge tone="amber">Not claimed yet</Badge>}
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`Remove the connection with ${other.name}?`)) remove.mutate();
        }}
        disabled={remove.isPending}
        aria-label={`Remove the connection with ${other.name}`}
        className="rounded-fx p-1.5 text-fx-muted hover:bg-fx-panel hover:text-fx-rose disabled:opacity-50"
      >
        <X className="size-4" />
      </button>
    </li>
  );
}

// The partners an organisation works with. Adding one puts it on the map straight away,
// and an unclaimed one can be invited to claim its profile — the referral loop.
export function ConnectionsPage() {
  const { orgSlug } = useParams({ from: "/_auth/$orgSlug/relations" });
  const { data: org } = useSuspenseQuery(organizationProfileQueryOptions(orgSlug));
  const byId = new Map(org.related_organizations.map((o) => [o.id, o]));
  const rows = org.relations
    .map((relation) => {
      const otherId = relation.from_organization_id === org.id ? relation.to_organization_id : relation.from_organization_id;
      return { relation, other: byId.get(otherId) };
    })
    .filter((row): row is { relation: OrganizationRelation; other: Related } => !!row.other);

  return (
    <>
      <PageHeader
        eyebrow={org.name}
        title="Connections"
        lede="The organisations you work with. They appear on your public profile, and the ones not on FABRIX yet can be invited to claim their own."
        actions={<AddConnectionDialog org={org} />}
      />

      <div className="mt-10">
        {rows.length === 0 ? (
          <EmptyState
            title="No connections yet"
            description="Suppliers, clients, collectors, service providers — add the ones you already work with. It takes a minute, and it is how the network grows."
            action={
              <ButtonLink to="/organizations/new">
                <Plus className="size-4" strokeWidth={2.6} />
                Add a partner
              </ButtonLink>
            }
          />
        ) : (
          <Card className="p-0">
            <ul>
              {rows.map(({ relation, other }) => (
                <ConnectionRow key={relation.id} org={org} other={other} relation={relation} />
              ))}
            </ul>
          </Card>
        )}
      </div>
    </>
  );
}
