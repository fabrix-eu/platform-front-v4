import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { AuthShell, linkClass, submitClass } from "@/features/auth/AuthShell";
import { requestPasswordReset } from "@/features/auth/api";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

const backToLogin = (
  <Link to="/login" className={linkClass}>
    Back to sign in
  </Link>
);

function ForgotPasswordPage() {
  const mutation = useMutation({ mutationFn: requestPasswordReset });

  if (mutation.isSuccess) {
    return (
      <AuthShell
        title="Check your inbox"
        lede="If an account exists with that email, we've sent you a link to reset your password."
        footer={backToLogin}
      >
        {null}
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Forgot password"
      lede="Enter your email and we'll send you a link to reset your password."
      footer={backToLogin}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(String(new FormData(e.currentTarget).get("email")).trim());
        }}
      >
        <FormError mutation={mutation} />
        <Field label="Email" name="email" type="email" required autoComplete="email" mutation={mutation} />
        <button type="submit" disabled={mutation.isPending} className={submitClass}>
          {mutation.isPending ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}
