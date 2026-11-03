import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Toggles";
import { updateOrganization } from "../../api";
import type { OrganizationProfile } from "../../types";
import { SpecialtiesField } from "../../wizard/SpecialtiesField";
import { ChoiceChips } from "./ChoiceChips";
import { FormGroup } from "./FormGroup";
import { MATERIAL_SUGGESTIONS, SECTORS, SUPPORT_ROLES, VALUE_CHAIN_STAGES } from "./profileOptions";
import { TagListField } from "./TagListField";

const FIELDS = ["support_only", "value_chain_stages", "support_roles", "support_roles_other", "sectors", "materials", "specialties"];

const publicBadge = <Badge tone="slate">Public</Badge>;

// B · What you do — where the organisation comes in the making process, how it supports
// others, its sectors, materials and specialties (on the listing taxonomy). The API
// derives the organisation type from these answers.
export function WhatYouDoForm({ org }: { org: OrganizationProfile }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // Ephemeral: "we don't handle the product" hides the value-chain question.
  const [supportOnly, setSupportOnly] = useState(org.support_only);
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateOrganization>[1]) => updateOrganization(org.id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
      toast("What you do saved");
    },
  });

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const list = (key: string) => fd.getAll(key).map(String);
        const other = String(fd.get("support_roles_other") ?? "").trim();
        mutation.mutate({
          support_only: fd.get("support_only") != null,
          value_chain_stages: list("value_chain_stages"),
          support_roles: list("support_roles"),
          support_roles_other: other || null,
          sectors: list("sectors"),
          materials: list("materials"),
          specialties: list("specialties"),
        });
      }}
    >
      <FormError mutation={mutation} fields={FIELDS} />

      <FormGroup title="Your part in the making process" description="This helps others find you and adapt the search algorithm." aside={publicBadge}>
        <Checkbox
          name="support_only"
          defaultChecked={org.support_only}
          onChange={(e) => setSupportOnly(e.currentTarget.checked)}
          label="We don't handle the product ourselves — we support others who make things."
        />
        {!supportOnly && (
          <ChoiceChips
            label="Do you make or handle the product itself? Where do you come in?"
            name="value_chain_stages"
            options={VALUE_CHAIN_STAGES}
            defaultValue={org.value_chain_stages}
            hint="Choose as many as apply."
            mutation={mutation}
          />
        )}
        <ChoiceChips
          label="Do you support others who make things? How?"
          name="support_roles"
          options={SUPPORT_ROLES}
          defaultValue={org.support_roles}
          hint="Choose as many as apply — a maker can hold a supporting role too."
          mutation={mutation}
        />
        <Field
          label="Not listed? Tell us how"
          name="support_roles_other"
          defaultValue={org.support_roles_other}
          hint="We log what you write here to improve the list."
          mutation={mutation}
        />
      </FormGroup>

      <FormGroup title="Sectors" description="A broad signal to help people find you. Most organisations pick one or two." aside={publicBadge}>
        <ChoiceChips label="Sectors" name="sectors" options={SECTORS} defaultValue={org.sectors} mutation={mutation} />
      </FormGroup>

      <FormGroup title="Materials & products" aside={publicBadge}>
        <TagListField
          label="What materials or products do you work with?"
          name="materials"
          initial={org.materials}
          suggestions={MATERIAL_SUGGESTIONS}
          placeholder="Start typing a material or product…"
          hint="Pick a suggestion where you can — it is what lets someone searching for “linen in Rotterdam” find you."
          mutation={mutation}
        />
      </FormGroup>

      <FormGroup title="Your specialties" description="The same vocabulary as the Marketplace, so a search for a category of listing finds you too." aside={publicBadge}>
        <SpecialtiesField initial={org.specialties} legend="Areas of work" />
      </FormGroup>

      <div className="flex justify-end border-t border-fx-line pt-6">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save what you do"}
        </Button>
      </div>
    </form>
  );
}
