import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateOrganization } from "../../api";
import type { OrganizationProfile } from "../../types";
import { ChoiceChips } from "./ChoiceChips";
import { FormGroup } from "./FormGroup";
import { CERTIFICATIONS } from "./profileOptions";
import { TagListField } from "./TagListField";

const KNOWN = new Set(CERTIFICATIONS.map((c) => c.value));

// E · Certifications — the common ones as chips ("None" rules out the others), anything
// else added as typed. Both travel in `certifications`.
export function CertificationsForm({ org }: { org: OrganizationProfile }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateOrganization>[1]) => updateOrganization(org.id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
      toast("Certifications saved");
    },
  });

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        mutation.mutate({ certifications: [...fd.getAll("certifications"), ...fd.getAll("certifications_other")].map(String) });
      }}
    >
      <FormError mutation={mutation} fields={["certifications"]} />

      <FormGroup
        title="Do you hold any certifications or standards?"
        description={'Quick to answer, and people really do filter on it. "None" is a perfectly good answer.'}
        aside={<Badge tone="teal">Public</Badge>}
      >
        <ChoiceChips
          label="Certifications"
          name="certifications"
          options={CERTIFICATIONS}
          defaultValue={org.certifications}
          exclusive="none"
          mutation={mutation}
        />
        <TagListField
          label="Another one"
          name="certifications_other"
          initial={org.certifications.filter((c) => !KNOWN.has(c))}
          placeholder="e.g. Fair Wear, bluesign, Cradle to Cradle…"
          mutation={mutation}
        />
      </FormGroup>

      <div className="flex justify-end border-t border-fx-line pt-6">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save certifications"}
        </Button>
      </div>
    </form>
  );
}
