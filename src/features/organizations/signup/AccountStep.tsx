import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FormError } from "@/components/FieldError";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { ACCOUNT_FIELDS, AccountFields, readAccount } from "@/features/auth/AccountFields";
import { register, registerWithClaim, registerWithOrganization, type RegisterParams } from "@/features/auth/api";
import type { OrganizationDraft, OrganizationSummary } from "../types";
import { OrgSummaryCard } from "../wizard/OrgSummaryCard";

export type SignupChoice =
  | { kind: "none" }
  | { kind: "create"; draft: OrganizationDraft }
  | { kind: "claim"; organization: OrganizationSummary }
  | { kind: "join"; organization: OrganizationSummary };

function ChoiceSummary({ choice }: { choice: SignupChoice }) {
  if (choice.kind === "none") return null;
  const org = choice.kind === "create" ? { name: choice.draft.name, kind: choice.draft.kind, address: choice.draft.address } : choice.organization;
  const note = {
    create: "You create this organisation on FABRIX and manage its profile.",
    claim: "You ask to manage this profile. The FABRIX team checks the request, then it is yours.",
    join: "Someone already manages this profile. Once signed in, ask them to add you as a member.",
  }[choice.kind];

  return (
    <div className="space-y-3">
      <OrgSummaryCard name={org.name} kind={org.kind} address={org.address} imageUrl={"image_url" in org ? org.image_url : null} />
      <Banner tone="info">{note}</Banner>
    </div>
  );
}

function submit(choice: SignupChoice, user: RegisterParams) {
  if (choice.kind === "create") return registerWithOrganization(user, choice.draft);
  if (choice.kind === "claim") return registerWithClaim(user, choice.organization.id);
  return register(user);
}

export function AccountStep({ choice, onBack }: { choice: SignupChoice; onBack: () => void }) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (user: RegisterParams) => submit(choice, user),
    onSuccess: () => navigate({ to: "/verify-instructions" }),
  });

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(readAccount(new FormData(e.currentTarget)));
      }}
    >
      <ChoiceSummary choice={choice} />
      <FormError mutation={mutation} fields={ACCOUNT_FIELDS} />
      <AccountFields mutation={mutation} />
      <p className="text-fx-small text-fx-muted">We send you an email to confirm your address before you sign in.</p>
      <div className="flex flex-wrap justify-between gap-3 border-t border-fx-line pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating your account…" : "Create account"}
        </Button>
      </div>
    </form>
  );
}
