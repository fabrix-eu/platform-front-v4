import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { meQueryOptions } from "@/lib/auth";
import { Field } from "@/components/Field";
import { useToast } from "@/components/Toast";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { createOrganization } from "../api";
import type { OrganizationDraft, OrganizationSummary } from "../types";
import { OrgDetailsStep } from "../wizard/OrgDetailsStep";
import { OrgSearchStep } from "../wizard/OrgSearchStep";
import { ClaimStep } from "./ClaimStep";
import { DoneStep, type Outcome } from "./DoneStep";
import { RelationStep, type Relation } from "./RelationStep";

type Step = { name: "search" } | { name: "claim"; organization: OrganizationSummary } | { name: "relation"; orgName: string } | { name: "details"; orgName: string; relation: Relation } | { name: "done"; outcome: Outcome };

const HEADERS: Record<Step["name"], { title: string; lede: string }> = {
  search: { title: "Add an organisation", lede: "Yours, or a partner you work with. Search first — it may already be on FABRIX." },
  claim: { title: "Claim this organisation", lede: "Tell the FABRIX team who you are there." },
  relation: { title: "Who is it to you?", lede: "It decides who manages the profile." },
  details: { title: "Its details", lede: "What others see when they find it." },
  done: { title: "Done", lede: "" },
};

export function NewOrganizationPage() {
  // A wizard: the step and what it carries are local state until the final request.
  const [step, setStep] = useState<Step>({ name: "search" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ draft, relation, email }: { draft: OrganizationDraft; relation: Relation; email: string }) =>
      // "" makes me the owner; a partner's email invites them; nothing leaves it unclaimed.
      createOrganization({ ...draft, owner_email: relation === "mine" ? "" : email || undefined }),
    onSuccess: async (org, { relation, email }) => {
      if (relation === "partner") return setStep({ name: "done", outcome: { kind: "partner", name: org.name, invited: email || undefined } });
      await queryClient.fetchQuery({ ...meQueryOptions, staleTime: 0 });
      toast(`${org.name} is on FABRIX`);
      navigate({ to: "/$orgSlug/dashboard", params: { orgSlug: org.slug } });
    },
  });

  const header = HEADERS[step.name];

  return (
    <div className="max-w-3xl">
      <PageHeader title={header.title} lede={header.lede || undefined} />
      <Card className="mt-10 p-6 sm:p-8">
        {step.name === "search" && (
          <OrgSearchStep
            placeholder="Type the organisation's name"
            onPick={(organization) => setStep({ name: "claim", organization })}
            onCreate={(orgName) => setStep({ name: "relation", orgName })}
          />
        )}
        {step.name === "claim" && (
          <ClaimStep
            organization={step.organization}
            onBack={() => setStep({ name: "search" })}
            onDone={() => setStep({ name: "done", outcome: { kind: "claim", name: step.organization.name } })}
          />
        )}
        {step.name === "relation" && (
          <RelationStep name={step.orgName} onBack={() => setStep({ name: "search" })} onContinue={(relation) => setStep({ name: "details", orgName: step.orgName, relation })} />
        )}
        {step.name === "details" && (
          <OrgDetailsStep
            draft={{ name: step.orgName }}
            mutation={mutation}
            submitLabel={step.relation === "mine" ? "Create organisation" : "Add partner"}
            onBack={() => setStep({ name: "relation", orgName: step.orgName })}
            onSubmit={(draft, form) => mutation.mutate({ draft, relation: step.relation, email: String(form.get("owner_email") ?? "").trim() })}
          >
            {step.relation === "partner" && (
              <div>
                <Field label="Their email" name="owner_email" type="email" placeholder="contact@partner.eu" mutation={mutation} />
                <p className="mt-1.5 text-fx-small text-fx-muted">Optional. We invite them to claim the profile — the fastest way to bring a partner onto FABRIX.</p>
              </div>
            )}
          </OrgDetailsStep>
        )}
        {step.name === "done" && <DoneStep outcome={step.outcome} onAddAnother={() => setStep({ name: "search" })} />}
      </Card>
    </div>
  );
}
