import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/auth";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { AuthShell, linkClass, submitClass } from "@/features/auth/AuthShell";
import { PasswordInput } from "@/features/auth/PasswordInput";
import { SIGNUP_URL } from "@/features/auth/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: () => navigate({ to: "/" }),
  });

  return (
    <AuthShell
      title="Sign in"
      footer={
        <>
          New to FABRIX?{" "}
          <a href={SIGNUP_URL} className={linkClass}>
            Create an account
          </a>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          mutation.mutate({ email: String(fd.get("email")).trim(), password: String(fd.get("password")) });
        }}
      >
        <FormError mutation={mutation} />
        <Field label="Email" name="email" type="email" required autoComplete="email" mutation={mutation} />
        <PasswordInput
          name="password"
          label="Password"
          autoComplete="current-password"
          mutation={mutation}
          labelAside={
            <Link to="/forgot-password" className={`text-fx-small ${linkClass}`}>
              Forgot password?
            </Link>
          }
        />
        <button type="submit" disabled={mutation.isPending} className={submitClass}>
          {mutation.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
