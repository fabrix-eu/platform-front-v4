import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { AuthShell, linkClass, submitClass } from "@/features/auth/AuthShell";
import { PasswordInput } from "@/features/auth/PasswordInput";
import { register } from "@/features/auth/api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

// Account-only signup. Registering or claiming an organization at signup comes
// with the org wizard (search → claim or create).
function RegisterPage() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => navigate({ to: "/verify-instructions" }),
  });

  return (
    <AuthShell
      title="Create an account"
      lede="Join FABRIX to find partners and resources in the circular textile ecosystem."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className={linkClass}>
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          mutation.mutate({
            name: String(fd.get("name")).trim(),
            email: String(fd.get("email")).trim(),
            password: String(fd.get("password")),
            password_confirmation: String(fd.get("password_confirmation")),
          });
        }}
      >
        <FormError mutation={mutation} />
        <Field label="Name" name="name" required autoComplete="name" mutation={mutation} />
        <Field label="Email" name="email" type="email" required autoComplete="email" mutation={mutation} />
        <PasswordInput name="password" label="Password" autoComplete="new-password" mutation={mutation} />
        <PasswordInput
          name="password_confirmation"
          label="Confirm password"
          autoComplete="new-password"
          mutation={mutation}
        />
        <button type="submit" disabled={mutation.isPending} className={submitClass}>
          {mutation.isPending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
