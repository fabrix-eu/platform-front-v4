import { useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Field } from "@/components/Field";
import { FormError, type AnyMutation } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { Button } from "@/components/ui/Button";
import { ORG_KIND_LABELS } from "../kinds";
import type { OrganizationDraft } from "../types";
import { AddressField } from "./AddressField";
import { SpecialtiesField } from "./SpecialtiesField";

const KIND_OPTIONS = Object.entries(ORG_KIND_LABELS).map(([value, label]) => ({ value, label }));

export function readOrganizationDraft(fd: FormData): OrganizationDraft {
  const number = (key: string) => {
    const value = fd.get(key);
    return typeof value === "string" && value !== "" ? Number(value) : null;
  };
  return {
    name: String(fd.get("name") ?? "").trim(),
    kind: String(fd.get("kind") ?? ""),
    address: String(fd.get("address") ?? ""),
    country_code: String(fd.get("country_code") ?? ""),
    lat: number("lat"),
    lon: number("lon"),
    specialties: fd.getAll("specialties").map(String),
  };
}

interface OrgDetailsStepProps {
  draft: Partial<OrganizationDraft>;
  mutation: AnyMutation;
  submitLabel: string;
  onBack: () => void;
  /** The organisation's fields, plus the raw form for the extra fields passed as children. */
  onSubmit: (draft: OrganizationDraft, form: FormData) => void;
  /** Extra fields after the organisation's (e.g. the partner's email to invite). */
  children?: ReactNode;
}

export function OrgDetailsStep({ draft, mutation, submitLabel, onBack, onSubmit, children }: OrgDetailsStepProps) {
  // Ephemeral: an address typed but not picked cannot be placed on the map.
  const [addressError, setAddressError] = useState<string | null>(null);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const next = readOrganizationDraft(form);
        if (next.lat === null || next.lon === null) {
          setAddressError("Pick the address from the suggestions, so partners can find you on the map.");
          return;
        }
        onSubmit(next, form);
      }}
    >
      <FormError mutation={mutation} fields={["name", "kind", "address", "country_code", "owner_email"]} />
      <Field label="Organisation name" name="name" required defaultValue={draft.name} mutation={mutation} />
      <SelectField label="Type" name="kind" required placeholder="Choose a type" defaultValue={draft.kind} options={KIND_OPTIONS} mutation={mutation} />
      <AddressField initial={draft} error={addressError} onPicked={() => setAddressError(null)} mutation={mutation} />
      <SpecialtiesField initial={draft.specialties} />
      {children}
      <div className="flex flex-wrap justify-between gap-3 border-t border-fx-line pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
