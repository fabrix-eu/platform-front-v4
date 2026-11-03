import { useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Field } from "@/components/Field";
import { FormError, type AnyMutation } from "@/components/FieldError";
import { Button } from "@/components/ui/Button";
import type { OrganizationDraft } from "../types";
import { AddressField } from "./AddressField";
import { PositionFields } from "./PositionFields";

export function readOrganizationDraft(fd: FormData): OrganizationDraft {
  const number = (key: string) => {
    const value = fd.get(key);
    return typeof value === "string" && value !== "" ? Number(value) : null;
  };
  return {
    name: String(fd.get("name") ?? "").trim(),
    address: String(fd.get("address") ?? ""),
    country_code: String(fd.get("country_code") ?? ""),
    lat: number("lat"),
    lon: number("lon"),
    value_chain_stages: fd.getAll("value_chain_stages").map(String),
    support_roles: fd.getAll("support_roles").map(String),
    support_roles_other: String(fd.get("support_roles_other") ?? "").trim() || null,
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
  // Ephemeral too: the API asks for a position, but on sign-up it is only sent
  // after the account step — so say it here, where it can be answered.
  const [positionError, setPositionError] = useState<string | null>(null);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const next = readOrganizationDraft(form);
        const placed = next.lat !== null && next.lon !== null;
        const positioned = next.value_chain_stages.length > 0 || next.support_roles.length > 0;
        setAddressError(placed ? null : "Pick the address from the suggestions, so partners can find you on the map.");
        setPositionError(positioned ? null : "Pick where you sit in the value chain, or how you support it.");
        if (!placed || !positioned) return;
        onSubmit(next, form);
      }}
    >
      <FormError mutation={mutation} fields={["name", "address", "country_code", "value_chain_stages", "support_roles", "support_roles_other", "owner_email"]} />
      <Field label="Organisation name" name="name" required defaultValue={draft.name} mutation={mutation} />
      <AddressField initial={draft} error={addressError} onPicked={() => setAddressError(null)} mutation={mutation} />
      <PositionFields initial={draft} mutation={mutation} error={positionError} />
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
