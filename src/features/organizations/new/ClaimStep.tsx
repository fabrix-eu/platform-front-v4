import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Banner } from "@/components/ui/Banner";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { OrganizationSummary } from "../types";
import { OrgSummaryCard } from "../wizard/OrgSummaryCard";
import { ClaimForm } from "./ClaimForm";

interface ClaimStepProps {
  organization: OrganizationSummary;
  onBack: () => void;
  onDone: () => void;
}

export function ClaimStep({ organization, onBack, onDone }: ClaimStepProps) {
  const back = (
    <Button variant="ghost" onClick={onBack}>
      <ArrowLeft className="size-4" />
      {organization.claimed ? "Search again" : "Back"}
    </Button>
  );

  return (
    <div className="space-y-5">
      <OrgSummaryCard name={organization.name} kind={organization.kind} address={organization.address} imageUrl={organization.image_url} />
      {organization.claimed ? (
        <>
          <Banner
            tone="info"
            label="Managed"
            action={
              <ButtonLink to="/organizations/$id" params={{ id: organization.slug || organization.id }} size="sm" variant="outline">
                Its profile
                <ArrowUpRight className="size-4" />
              </ButtonLink>
            }
          >
            Someone already manages this profile. From its profile, ask to join the team.
          </Banner>
          {back}
        </>
      ) : (
        <ClaimForm organizationId={organization.id} onDone={onDone} secondary={back} />
      )}
    </div>
  );
}
