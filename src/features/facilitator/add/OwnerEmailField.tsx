import { Field } from "@/components/Field";
import type { AnyMutation } from "@/components/FieldError";

// The referral lever: whoever runs the organisation is invited to claim its profile.
export function OwnerEmailField({ mutation }: { mutation: AnyMutation }) {
  return (
    <div>
      <Field label="Who runs it? Their email" name="owner_email" type="email" placeholder="contact@organisation.eu" mutation={mutation} />
      <p className="mt-1.5 text-fx-small text-fx-muted">
        Optional. We invite them to claim the profile and join FABRIX — the invitation stays valid for a year.
      </p>
    </div>
  );
}

export const readOwnerEmail = (form: FormData) => String(form.get("owner_email") ?? "").trim() || undefined;
