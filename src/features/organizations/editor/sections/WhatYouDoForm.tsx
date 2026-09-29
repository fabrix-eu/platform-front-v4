import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateOrganization } from "../../api";
import type { OrganizationProfile } from "../../types";
import { SpecialtiesField } from "../../wizard/SpecialtiesField";
import { FormGroup } from "./FormGroup";

const publicBadge = <Badge tone="slate">Public</Badge>;

// B · What you do — the sector and the specialties, on the listing taxonomy (a partner who
// searches "sorting" finds both the listings and the organisations that do it). The kind of
// organisation stands in for the value-chain role and is edited in A · Identity. The
// prototype's support roles and materials have no field on the API yet.
export function WhatYouDoForm({ org }: { org: OrganizationProfile }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
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
        const sector = String(fd.get("sector") ?? "").trim();
        mutation.mutate({ sector: sector || null, specialties: fd.getAll("specialties").map(String) });
      }}
    >
      <FormError mutation={mutation} fields={["sector", "specialties"]} />

      <FormGroup
        title="Sector"
        description="A broad signal to help people find you. One or two words — most organisations put Textile & clothing."
        aside={publicBadge}
      >
        <div className="sm:max-w-sm">
          <Field label="Sector" name="sector" placeholder="Textile & clothing" defaultValue={org.sector} mutation={mutation} />
        </div>
      </FormGroup>

      <FormGroup
        title="Your specialties"
        description="The same vocabulary as the Marketplace, so a search for a category of listing finds you too."
        aside={publicBadge}
      >
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
