import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { specialtyLabel } from "@/features/listings/taxonomy";
import { orgKindLabel } from "@/features/organizations/kinds";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { NetworkOrganization } from "../types";
import { HealthSelect } from "./HealthSelect";
import { UnfollowButton } from "./UnfollowButton";

export function RecordHeader({ networkSlug, record }: { networkSlug: string; record: NetworkOrganization }) {
  const org = record.organization;
  const specialties = (org.specialties ?? []).map(specialtyLabel).filter((label): label is string => !!label);

  return (
    <>
      <Link
        to="/facilitator/$networkSlug"
        params={{ networkSlug }}
        search={{ tab: "organisations" }}
        className="inline-flex items-center gap-1.5 text-fx-small font-bold text-fx-ink2 hover:text-fx-emphasis"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Organisations
      </Link>

      <Card className="mt-4 flex flex-wrap items-start gap-4 p-5">
        <Avatar name={org.name} src={org.image_url} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="min-w-0 truncate font-fx-display text-fx-title text-fx-ink">{org.name}</h1>
            <Badge tone="slate">{orgKindLabel(org.kind)}</Badge>
          </div>
          {org.address && <p className="mt-1 truncate text-fx-small text-fx-muted">{org.address}</p>}

          {specialties.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {specialties.map((label) => (
                <Badge key={label} tone="teal">{label}</Badge>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <HealthSelect networkSlug={networkSlug} record={record} field="economic_health" label="Economic" />
            <HealthSelect networkSlug={networkSlug} record={record} field="environmental_score" label="Environmental" />
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <ButtonLink to="/organizations/$id" params={{ id: org.slug ?? org.id }} variant="secondary" size="sm" preload="intent">
            Public profile
          </ButtonLink>
          <UnfollowButton networkSlug={networkSlug} recordId={record.id} organizationName={org.name} />
        </div>
      </Card>
    </>
  );
}
