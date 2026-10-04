import { ArrowLeft } from "lucide-react";
import { FormError, type AnyMutation } from "@/components/FieldError";
import { Button } from "@/components/ui/Button";
import type { OrganizationSummary } from "@/features/organizations/types";
import { OrgSummaryCard } from "@/features/organizations/wizard/OrgSummaryCard";
import { OwnerEmailField, readOwnerEmail } from "./OwnerEmailField";

interface PickedStepProps {
  organization: OrganizationSummary;
  mutation: AnyMutation;
  onBack: () => void;
  onAdd: (ownerEmail: string | undefined) => void;
}

// Already on FABRIX: follow it. Nobody runs it yet? Its owner can be invited on the way.
export function PickedStep({ organization, mutation, onBack, onAdd }: PickedStepProps) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(readOwnerEmail(new FormData(e.currentTarget)));
      }}
    >
      <FormError mutation={mutation} fields={["owner_email"]} />
      <OrgSummaryCard name={organization.name} kind={organization.kind} address={organization.address} imageUrl={organization.image_url} />
      {organization.claimed ? (
        <p className="text-fx-small text-fx-muted">Its team manages this profile already.</p>
      ) : (
        <OwnerEmailField mutation={mutation} />
      )}
      <div className="flex flex-wrap justify-between gap-3 border-t border-fx-line pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding…" : "Add to the network"}
        </Button>
      </div>
    </form>
  );
}
