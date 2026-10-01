import type { AnyMutation } from "@/components/FieldError";
import { Field, labelClass } from "@/components/Field";
import { PasswordInput } from "@/features/auth/PasswordInput";
import type { NewAccount } from "./api";

export const ACCOUNT_FORM_FIELDS = ["name", "password", "password_confirmation"];

export function readNewAccount(fd: FormData): NewAccount {
  return {
    name: String(fd.get("name") ?? "").trim(),
    password: String(fd.get("password") ?? ""),
    password_confirmation: String(fd.get("password_confirmation") ?? ""),
  };
}

/** The account an invitee creates from the link: the email is the invitation's, not a choice. */
export function AccountFormFields({ email, mutation }: { email: string; mutation: AnyMutation }) {
  return (
    <>
      <div>
        <p className={labelClass}>Email</p>
        <p className="rounded-fx border border-fx-line bg-fx-panel px-4 py-3 text-fx-body text-fx-ink2">{email}</p>
        <p className="mt-1.5 text-fx-small text-fx-muted">The invitation was sent to this address, so the account is opened with it.</p>
      </div>
      <Field label="Your name" name="name" required autoComplete="name" mutation={mutation} />
      <div className="grid gap-5 sm:grid-cols-2">
        <PasswordInput name="password" label="Password" autoComplete="new-password" mutation={mutation} />
        <PasswordInput name="password_confirmation" label="Confirm password" autoComplete="new-password" mutation={mutation} />
      </div>
    </>
  );
}
