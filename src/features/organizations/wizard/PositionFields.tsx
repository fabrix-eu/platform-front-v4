import type { AnyMutation } from "@/components/FieldError";
import { ChoiceChips } from "../editor/sections/ChoiceChips";
import { VALUE_CHAIN_STAGES } from "../position";
import { SupportRolesField } from "./SupportRolesField";

interface PositionFieldsProps {
  initial: { value_chain_stages?: string[]; support_roles?: string[]; support_roles_other?: string | null };
  mutation: AnyMutation;
  /** The "pick at least one" reminder, before the form goes to the API. */
  error?: string | null;
}

// Where a new organisation sits: a stage of the value chain, or a way it supports
// the chain — at least one of the two. It is what the directory filters on.
export function PositionFields({ initial, mutation, error }: PositionFieldsProps) {
  return (
    <div className="space-y-5">
      <ChoiceChips
        label="Where do you sit in the value chain? *"
        name="value_chain_stages"
        options={VALUE_CHAIN_STAGES}
        defaultValue={initial.value_chain_stages ?? []}
        hint="Choose as many as apply — partners find you by it."
        mutation={mutation}
      />
      <SupportRolesField
        label="Or do you support the chain? How?"
        hint="A maker can hold a supporting role too."
        defaultValue={initial.support_roles ?? []}
        defaultOther={initial.support_roles_other}
        mutation={mutation}
      />
      {error && (
        <p role="alert" className="text-fx-small text-fx-rose">
          {error}
        </p>
      )}
    </div>
  );
}
