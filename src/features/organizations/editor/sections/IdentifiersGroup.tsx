import { useState } from "react";
import { Field } from "@/components/Field";
import { FieldError, type AnyMutation } from "@/components/FieldError";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Checkbox } from "@/components/ui/Toggles";
import type { OrganizationProfile } from "../../types";
import { FormGroup } from "./FormGroup";

// Identifiers — optional to appear and be counted. "I have neither" is an answer, not
// a blank: it swaps both numbers for one line on what kind of organisation this is.
export function IdentifiersGroup({ org, mutation }: { org: OrganizationProfile; mutation: AnyMutation }) {
  // Ephemeral: which of the two answers is shown. The value sent is the checkbox.
  const [none, setNone] = useState(org.no_identifier);

  return (
    <FormGroup
      title="Identifiers"
      description="Optional to appear and be counted — needed only to post to the Marketplace or community categories."
      aside={<Badge tone="teal">Public</Badge>}
    >
      {!none && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Registration number in the national business register"
            name="registration_number"
            placeholder="KVK · GEMI · SIREN…"
            defaultValue={org.registration_number}
            mutation={mutation}
          />
          <Field label="VAT number, if you have one" name="vat_code" placeholder="e.g. NL814213175B01" defaultValue={org.vat_code} hint="Optional" mutation={mutation} />
        </div>
      )}
      <div>
        <Checkbox
          name="no_identifier"
          defaultChecked={org.no_identifier}
          onChange={(e) => setNone(e.currentTarget.checked)}
          label="I do not have either — neither a registration number nor a VAT number."
        />
        <FieldError mutation={mutation} field="no_identifier" />
      </div>
      {none && (
        <>
          <Field
            label="What kind of organisation are you, in that case?"
            name="no_identifier_description"
            placeholder="e.g. an informal repair collective"
            defaultValue={org.no_identifier_description}
            hint="One line"
            mutation={mutation}
          />
          <Banner tone="info">
            This is an answer, not a blank. Plenty of real making sits outside the business register — telling us is genuinely useful. To post to the
            Marketplace, a facilitator will vouch for you instead.
          </Banner>
        </>
      )}
    </FormGroup>
  );
}
