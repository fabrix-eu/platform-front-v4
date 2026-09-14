import { Field } from "@/components/Field";
import type { AnyMutation } from "@/components/FieldError";
import type { RegisterParams } from "./api";
import { PasswordInput } from "./PasswordInput";

export const ACCOUNT_FIELDS = ["name", "email", "password", "password_confirmation"];

export function readAccount(fd: FormData): RegisterParams {
  return {
    name: String(fd.get("name") ?? "").trim(),
    email: String(fd.get("email") ?? "").trim(),
    password: String(fd.get("password") ?? ""),
    password_confirmation: String(fd.get("password_confirmation") ?? ""),
  };
}

export function AccountFields({ mutation }: { mutation: AnyMutation }) {
  return (
    <>
      <Field label="Your name" name="name" required autoComplete="name" mutation={mutation} />
      <Field label="Email" name="email" type="email" required autoComplete="email" mutation={mutation} />
      <div className="grid gap-5 sm:grid-cols-2">
        <PasswordInput name="password" label="Password" autoComplete="new-password" mutation={mutation} />
        <PasswordInput name="password_confirmation" label="Confirm password" autoComplete="new-password" mutation={mutation} />
      </div>
    </>
  );
}
