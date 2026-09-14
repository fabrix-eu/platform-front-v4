import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { FormError } from "@/components/FieldError";
import { AuthShell, linkClass, submitClass } from "@/features/auth/AuthShell";
import { PasswordInput } from "@/features/auth/PasswordInput";
import { resetPassword } from "@/features/auth/api";

export const Route = createFileRoute("/reset-password")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useSearch();
  const mutation = useMutation({ mutationFn: resetPassword });

  if (!token) {
    return (
      <AuthShell
        title="Invalid link"
        lede="This password reset link is invalid or has expired."
        footer={<Link to="/forgot-password" className={linkClass}>Request a new link</Link>}
      >
        {null}
      </AuthShell>
    );
  }

  if (mutation.isSuccess) {
    return (
      <AuthShell
        title="Password changed"
        lede="Your password has been reset. You can sign in with it now."
        footer={<Link to="/login" className={linkClass}>Sign in</Link>}
      >
        {null}
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" lede="Choose a new password for your account.">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          mutation.mutate({
            token,
            password: String(fd.get("password")),
            password_confirmation: String(fd.get("password_confirmation")),
          });
        }}
      >
        <FormError mutation={mutation} />
        <PasswordInput name="password" label="New password" autoComplete="new-password" mutation={mutation} />
        <PasswordInput
          name="password_confirmation"
          label="Confirm password"
          autoComplete="new-password"
          mutation={mutation}
        />
        <button type="submit" disabled={mutation.isPending} className={submitClass}>
          {mutation.isPending ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </AuthShell>
  );
}
