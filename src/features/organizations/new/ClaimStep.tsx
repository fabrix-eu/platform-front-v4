import { useMutation } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { FormError } from "@/components/FieldError";
import { TextareaField } from "@/components/TextareaField";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { claimOrganization } from "../api";
import type { OrganizationSummary } from "../types";
import { OrgSummaryCard } from "../wizard/OrgSummaryCard";

interface ClaimStepProps {
  organization: OrganizationSummary;
  onBack: () => void;
  onDone: () => void;
}

export function ClaimStep({ organization, onBack, onDone }: ClaimStepProps) {
  const mutation = useMutation({
    mutationFn: (justification: string) => claimOrganization(organization.id, justification),
    onSuccess: onDone,
  });

  if (organization.claimed) {
    return (
      <div className="space-y-5">
        <OrgSummaryCard name={organization.name} kind={organization.kind} address={organization.address} imageUrl={organization.image_url} />
        <Banner tone="info" label="Managed">
          Someone already manages this profile. Ask its team to add you — from their Members page, they can invite you in a minute.
        </Banner>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Search again
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(String(new FormData(e.currentTarget).get("justification") ?? "").trim());
      }}
    >
      <OrgSummaryCard name={organization.name} kind={organization.kind} address={organization.address} imageUrl={organization.image_url} />
      <FormError mutation={mutation} fields={["justification"]} />
      <TextareaField
        label="Your role there"
        name="justification"
        required
        rows={4}
        placeholder="e.g. I'm the production manager and handle our partnerships. You can reach me at…"
        mutation={mutation}
      />
      <p className="-mt-3 text-fx-small text-fx-muted">At least 20 characters. The FABRIX team reads it before handing you the profile.</p>
      <div className="flex flex-wrap justify-between gap-3 border-t border-fx-line pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending…" : "Send the claim"}
        </Button>
      </div>
    </form>
  );
}
