import { useState } from "react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import type { OrganizationSummary } from "@/features/organizations/types";
import { OrgDetailsStep } from "@/features/organizations/wizard/OrgDetailsStep";
import { OrgSearchStep } from "@/features/organizations/wizard/OrgSearchStep";
import { networkKey, networkQueryOptions } from "../api";
import { addNetworkOrganization, type Added, type AddOrganisationPayload } from "./api";
import { AddedStep } from "./AddedStep";
import { OwnerEmailField, readOwnerEmail } from "./OwnerEmailField";
import { PickedStep } from "./PickedStep";

type Step =
  | { name: "search" }
  | { name: "picked"; organization: OrganizationSummary }
  | { name: "details"; orgName: string }
  | { name: "done"; added: Added; invited?: string };

const HEADERS: Record<Step["name"], { title: string; lede?: string }> = {
  search: { title: "Add an organisation", lede: "Search first — it may already be on FABRIX. If not, you create it and invite whoever runs it." },
  picked: { title: "Add it to your network", lede: "It is on FABRIX already." },
  details: { title: "Its details", lede: "What others see when they find it on FABRIX." },
  done: { title: "Added" },
};

export function AddOrganisationPage({ networkSlug }: { networkSlug: string }) {
  const { data: network } = useSuspenseQuery(networkQueryOptions(networkSlug));
  // A wizard: the step and what it carries are local state until the request.
  const [step, setStep] = useState<Step>({ name: "search" });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: AddOrganisationPayload) => addNetworkOrganization(networkSlug, payload),
    onSuccess: (added, payload) => {
      queryClient.invalidateQueries({ queryKey: networkKey(networkSlug) });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setStep({ name: "done", added, invited: payload.owner_email });
    },
  });

  const go = (next: Step) => {
    mutation.reset();
    setStep(next);
  };
  const header = HEADERS[step.name];

  return (
    <div className="max-w-3xl">
      <Link
        to="/facilitator/$networkSlug"
        params={{ networkSlug }}
        search={{ tab: "organisations" }}
        className="inline-flex items-center gap-1.5 text-fx-small font-bold text-fx-ink2 hover:text-fx-emphasis"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {network.name}
      </Link>
      <PageHeader className="mt-4" title={header.title} lede={header.lede} />
      <Card className="mt-10 p-6 sm:p-8">
        {step.name === "search" && (
          <OrgSearchStep
            placeholder="Type the organisation's name"
            hint="Type at least two letters. If it is already on FABRIX, add it as it is — no duplicate."
            onPick={(organization) => go({ name: "picked", organization })}
            onCreate={(orgName) => go({ name: "details", orgName })}
          />
        )}
        {step.name === "picked" && (
          <PickedStep
            organization={step.organization}
            mutation={mutation}
            onBack={() => go({ name: "search" })}
            onAdd={(owner_email) => mutation.mutate({ organization_id: step.organization.id, owner_email })}
          />
        )}
        {step.name === "details" && (
          <OrgDetailsStep
            draft={{ name: step.orgName }}
            mutation={mutation}
            submitLabel="Create and add"
            onBack={() => go({ name: "search" })}
            onSubmit={(organization, form) => mutation.mutate({ organization, owner_email: readOwnerEmail(form) })}
          >
            <OwnerEmailField mutation={mutation} />
          </OrgDetailsStep>
        )}
        {step.name === "done" && (
          <AddedStep networkSlug={networkSlug} added={step.added} invited={step.invited} onAddAnother={() => go({ name: "search" })} />
        )}
      </Card>
    </div>
  );
}
