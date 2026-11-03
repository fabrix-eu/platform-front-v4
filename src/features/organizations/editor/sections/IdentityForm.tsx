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
import type { OrganizationProfile } from "../../types";
import { AddressField } from "../../wizard/AddressField";
import { FormGroup } from "./FormGroup";
import { IdentifiersGroup } from "./IdentifiersGroup";
import { legalFormOptions, SITE_RELATIONS } from "./profileOptions";

const FIELDS = [
  "name", "tagline", "description", "address", "country_code", "lat", "lon", "site_name", "site_relation", "website", "email", "phone",
  "linkedin", "instagram", "legal_form", "founded_year", "registration_number", "vat_code", "no_identifier", "no_identifier_description",
];

// A · Identity — who you are, where, how to reach you. The organisation type (`kind`)
// is no longer asked: the API derives it from B · What you do and the legal form.
// The prototype's existence check (peers, facilitator, FABRIX) is not built yet.
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
          tagline: text("tagline"),
          description: text("description"),
          ...(picked ? { address: text("address"), lat: Number(fd.get("lat")), lon: Number(fd.get("lon")), country_code: text("country_code") } : {}),
          website: text("website"),
          email: text("email"),
          phone: text("phone"),
          linkedin: text("linkedin"),
          instagram: text("instagram"),
          site_name: text("site_name"),
          site_relation: text("site_relation"),
          legal_form: text("legal_form"),
          founded_year: text("founded_year") === null ? null : Number(text("founded_year")),
          no_identifier: fd.get("no_identifier") != null,
          registration_number: text("registration_number"),
          vat_code: text("vat_code"),
          no_identifier_description: text("no_identifier_description"),
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
        <Field
          label="In one line, what does your organisation do?"
          name="tagline"
          defaultValue={org.tagline}
          placeholder="Small-batch cut-and-sew and garment repair in Rotterdam"
          hint="Shown in the Directory and in search results."
          mutation={mutation}
        />
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
        <SiteFields org={org} mutation={mutation} />
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
            name="legal_form"
            placeholder="Choose one"
            defaultValue={org.legal_form}
            options={legalFormOptions(org.legal_form)}
            hint="Recommended"
            mutation={mutation}
          />
          <Field
            label="What year did the organisation start?"
            name="founded_year"
            type="number"
            inputMode="numeric"
            defaultValue={org.founded_year?.toString()}
            hint="Recommended"
            mutation={mutation}
          />
        </div>
      </FormGroup>

      <IdentifiersGroup org={org} mutation={mutation} />

      <div className="flex justify-end border-t border-fx-line pt-6">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save identity"}
        </Button>
      </div>
    </form>
  );
}

// Normally optional; required once another profile shares the registration number, so
// two sites of one organisation are never mistaken for each other.
function SiteFields({ org, mutation }: { org: OrganizationProfile; mutation: Parameters<typeof Field>[0]["mutation"] }) {
  const required = !!org.registration_shared;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        label="The name of this site or branch"
        name="site_name"
        required={required}
        defaultValue={org.site_name}
        hint={required ? "Required — another site shares your registration number." : "Optional"}
        mutation={mutation}
      />
      <SelectField
        label="Is this a branch, subsidiary, franchise or campus of a larger organisation?"
        name="site_relation"
        required={required}
        placeholder="Choose one"
        defaultValue={org.site_relation}
        options={SITE_RELATIONS}
        mutation={mutation}
      />
    </div>
  );
}
