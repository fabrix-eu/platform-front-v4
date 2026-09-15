import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe } from "lucide-react";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { updateOrganization } from "../../api";
import { ORG_KIND_LABELS } from "../../kinds";
import type { OrganizationProfile } from "../../types";
import { AddressField } from "../../wizard/AddressField";
import { FormGroup } from "./FormGroup";
import { legalFormOptions } from "./legalForms";

const FIELDS = ["name", "description", "address", "country_code", "lat", "lon", "website", "email", "phone", "linkedin", "instagram", "kind", "legal_form", "vat_code"];

// Organization::KINDS — the same list as signup and the directory.
const KIND_OPTIONS = Object.entries(ORG_KIND_LABELS).map(([value, label]) => ({ value, label }));

// A · Identity — who you are, where, how to reach you. Every field is an existing
// organisation attribute; the prototype's tagline, site name, founding year,
// registration number and existence check have no field on the API yet.
export function IdentityForm({ org }: { org: OrganizationProfile }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  // Ephemeral: an address typed but not picked from the suggestions.
  const [addressError, setAddressError] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateOrganization>[1]) => updateOrganization(org.id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] }),
        queryClient.invalidateQueries({ queryKey: ["me"] }),
      ]);
      toast("Identity saved");
    },
  });

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const text = (key: string) => {
          const value = fd.get(key);
          return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
        };
        // The address travels only as a picked place (with its coordinates). An organisation
        // without coordinates can still save its name as long as the address text is unchanged.
        const picked = text("lat") !== null && text("lon") !== null;
        if (!picked && text("address_query") !== (org.address ?? null)) {
          setAddressError("Pick the address from the suggestions, so partners can find you on the map.");
          return;
        }
        setAddressError(null);
        mutation.mutate({
          name: text("name") ?? "",
          description: text("description"),
          ...(picked ? { address: text("address"), lat: Number(fd.get("lat")), lon: Number(fd.get("lon")), country_code: text("country_code") } : {}),
          website: text("website"),
          email: text("email"),
          phone: text("phone"),
          linkedin: text("linkedin"),
          instagram: text("instagram"),
          kind: text("kind"),
          legal_form: text("legal_form"),
          vat_code: text("vat_code"),
        });
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-fx-body text-fx-ink2">Who you are and how to reach you — the first things people see in the Directory.</p>
        <Badge tone="teal">
          <Globe aria-hidden className="size-3" />
          Public
        </Badge>
      </div>

      <FormError mutation={mutation} fields={FIELDS} />

      <FormGroup title="Who you are">
        <Field label="Organisation name" name="name" required defaultValue={org.name} mutation={mutation} />
        <TextareaField
          label="Tell people about your organisation"
          name="description"
          rows={5}
          defaultValue={org.description}
          placeholder="What you make or do, for whom, and what makes you easy to work with."
          hint="The longer story — on your profile, and searchable."
          mutation={mutation}
        />
      </FormGroup>

      <FormGroup title="Where you are">
        <AddressField
          initial={{ address: org.address ?? undefined, lat: org.lat, lon: org.lon, country_code: org.country_code ?? undefined }}
          error={addressError}
          onPicked={() => setAddressError(null)}
          mutation={mutation}
        />
      </FormGroup>

      <FormGroup title="How to reach you" description="A shared address, not a person.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Website" name="website" inputMode="url" placeholder="yourorganisation.eu" defaultValue={org.website} hint="Recommended" mutation={mutation} />
          <Field label="General contact" name="email" type="email" placeholder="hello@yourorganisation.eu" defaultValue={org.email} mutation={mutation} />
          <Field label="Phone" name="phone" type="tel" defaultValue={org.phone} mutation={mutation} />
          <Field label="LinkedIn" name="linkedin" inputMode="url" placeholder="linkedin.com/company/…" defaultValue={org.linkedin} mutation={mutation} />
          <Field label="Instagram" name="instagram" inputMode="url" placeholder="instagram.com/…" defaultValue={org.instagram} mutation={mutation} />
        </div>
      </FormGroup>

      <FormGroup title="What kind of organisation you are">
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label="What kind of organisation are you?"
            name="kind"
            required
            placeholder="Choose a type"
            defaultValue={org.kind}
            options={KIND_OPTIONS}
            mutation={mutation}
          />
          <SelectField
            label="Legal form"
            name="legal_form"
            placeholder="Choose one"
            defaultValue={org.legal_form}
            options={legalFormOptions(org.legal_form)}
            hint="Recommended"
            mutation={mutation}
          />
          <Field label="VAT number, if you have one" name="vat_code" placeholder="e.g. NL814213175B01" defaultValue={org.vat_code} hint="Optional" mutation={mutation} />
        </div>
      </FormGroup>

      <div className="flex justify-end border-t border-fx-line pt-6">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save identity"}
        </Button>
      </div>
    </form>
  );
}
