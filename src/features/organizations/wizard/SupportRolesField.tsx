import { useState } from "react";
import { Field } from "@/components/Field";
import type { AnyMutation } from "@/components/FieldError";
import { ChoiceChips } from "../editor/sections/ChoiceChips";
import { SUPPORT_ROLES } from "../position";

interface SupportRolesFieldProps {
  label: string;
  hint?: string;
  defaultValue: string[];
  defaultOther?: string | null;
  mutation: AnyMutation;
}

// The support roles, and — once "Other / not listed" is ticked — what it is.
// The chips stay uncontrolled; only whether "other" is ticked is mirrored.
export function SupportRolesField({ label, hint, defaultValue, defaultOther, mutation }: SupportRolesFieldProps) {
  const [other, setOther] = useState(defaultValue.includes("other"));

  return (
    <div
      className="space-y-4"
      onChange={(e) => {
        const input = e.target as HTMLInputElement;
        if (input.name === "support_roles" && input.value === "other") setOther(input.checked);
      }}
    >
      <ChoiceChips label={label} name="support_roles" options={SUPPORT_ROLES} defaultValue={defaultValue} hint={hint} mutation={mutation} />
      {other && (
        <Field
          label="Please specify"
          name="support_roles_other"
          required
          defaultValue={defaultOther}
          placeholder="e.g. Textile law, insurance…"
          hint="We read what you write here to improve the list."
          mutation={mutation}
        />
      )}
    </div>
  );
}
