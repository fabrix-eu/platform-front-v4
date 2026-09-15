import type { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { FormError } from "@/components/FieldError";
import { TextareaField } from "@/components/TextareaField";
import { Button } from "@/components/ui/Button";
import { claimOrganization } from "../api";

interface ClaimFormProps {
  organizationId: string;
  onDone: () => void;
  /** Left of the submit button (Back, Cancel…). */
  secondary?: ReactNode;
}

// Asking to manage an unclaimed organisation — shared by the add-organisation wizard
// and the organisation's public profile.
export function ClaimForm({ organizationId, onDone, secondary }: ClaimFormProps) {
  const mutation = useMutation({
    mutationFn: (justification: string) => claimOrganization(organizationId, justification),
    meta: { silentErrors: true },
    onSuccess: onDone,
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(String(new FormData(e.currentTarget).get("justification") ?? "").trim());
      }}
    >
      <FormError mutation={mutation} fields={["justification"]} />
      <TextareaField
        label="Your role there"
        name="justification"
        required
        rows={4}
        placeholder="e.g. I'm the production manager and handle our partnerships. You can reach me at…"
        mutation={mutation}
      />
      <p className="-mt-2 text-fx-small text-fx-muted">At least 20 characters. The FABRIX team reads it before handing you the profile.</p>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-fx-line pt-6">
        {secondary ?? <span />}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending…" : "Send the claim"}
        </Button>
      </div>
    </form>
  );
}
