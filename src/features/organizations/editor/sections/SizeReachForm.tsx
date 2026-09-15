import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Lock } from "lucide-react";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { useToast } from "@/components/Toast";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { updateOrganization } from "../../api";
import type { OrganizationProfile } from "../../types";
import { FormGroup } from "./FormGroup";
import { DEVELOPMENT_STAGES, sizeBand, TURNOVER_OPTIONS, turnoverBand } from "./sizeBands";

const privateBadge = (label: string) => (
  <Badge tone="slate">
    <Lock aria-hidden className="size-3" />
    {label}
  </Badge>
);

// C · Size & reach — on existing attributes: headcount, turnover (as a band) and
// development stage. The prototype's full-time equivalent and customer reach have no
// field on the API yet. None of these is shown publicly: the API only returns them to
// the organisation's team.
export function SizeReachForm({ org }: { org: OrganizationProfile }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // Ephemeral: the headcount as typed, only to show which band it falls in. The value
  // sent is read from the form.
  const [people, setPeople] = useState(org.number_of_workers ?? null);
  const storedBand = turnoverBand(org.turnover);
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateOrganization>[1]) => updateOrganization(org.id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
      toast("Size & reach saved");
    },
  });

  return (
    <form
      className="space-y-7"
      onChange={(e) => {
        const input = e.target;
        if (input instanceof HTMLInputElement && input.name === "number_of_workers") {
          setPeople(input.value.trim() === "" ? null : Number(input.value));
        }
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const workers = String(fd.get("number_of_workers") ?? "").trim();
        const band = String(fd.get("turnover_band") ?? "");
        const stage = String(fd.get("development_stage") ?? "");
        mutation.mutate({
          number_of_workers: workers === "" ? null : Number(workers),
          development_stage: stage || null,
          // Unchanged band: keep whatever exact amount is stored.
          ...(band !== storedBand ? { turnover: band === "" ? null : Number(band) } : {}),
        });
      }}
    >
      <FormError mutation={mutation} fields={["number_of_workers", "development_stage", "turnover"]} />

      <FormGroup title="How big you are" description="Your exact numbers stay private." aside={privateBadge("Not public")}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Field
              label="How many people work here?"
              name="number_of_workers"
              type="number"
              inputMode="numeric"
              defaultValue={org.number_of_workers?.toString()}
              hint="Count owners, employees, freelancers and regular sub-contractors."
              mutation={mutation}
            />
          </div>
          <SelectField
            label="How long have you been going?"
            name="development_stage"
            placeholder="Choose a stage"
            defaultValue={org.development_stage}
            options={DEVELOPMENT_STAGES}
            mutation={mutation}
          />
        </div>
        {people !== null && people > 0 && (
          <Banner tone="success">
            In local statistics this counts as <strong>{sizeBand(people)}</strong> — never the exact number.
          </Banner>
        )}
      </FormGroup>

      <FormGroup
        title="Turnover"
        description="The most sensitive field on this page, and entirely optional."
        aside={privateBadge("Never public")}
      >
        <Banner tone="info">
          <span className="flex items-start gap-2">
            <Eye aria-hidden className="mt-0.5 size-4 shrink-0 text-fx-emphasis" />
            <span>Only your organisation’s team sees it — never publicly, and never as an exact figure.</span>
          </span>
        </Banner>
        <div className="sm:max-w-sm">
          <SelectField
            label="Approximate yearly turnover — a range is fine"
            name="turnover_band"
            placeholder="Prefer not to say"
            defaultValue={storedBand}
            options={TURNOVER_OPTIONS}
            hint="Optional"
            mutation={mutation}
          />
        </div>
      </FormGroup>

      <div className="flex justify-end border-t border-fx-line pt-6">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save size & reach"}
        </Button>
      </div>
    </form>
  );
}
