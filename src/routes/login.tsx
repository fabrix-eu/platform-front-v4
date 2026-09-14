import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/auth";
import { Field, inputClass } from "@/components/Field";
import { FormError } from "@/components/FieldError";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  // Ephemeral: the field stays uncontrolled, only its `type` flips, so FormData still reads it.
  const [showPassword, setShowPassword] = useState(false);
  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: () => navigate({ to: "/" }),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-fx-panel px-4">
      <div className="w-full max-w-sm rounded-fx-lg border border-fx-line bg-fx-paper p-8">
        <img src="/fabrix-logo.svg" alt="FABRIX" className="h-8" />
        <h1 className="mt-8 text-fx-title text-fx-ink">Sign in</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            mutation.mutate({ email: String(fd.get("email")), password: String(fd.get("password")) });
          }}
        >
          <FormError mutation={mutation} />
          <Field label="Email" name="email" type="email" required autoComplete="email" mutation={mutation} />
          <div>
            <label htmlFor="password" className="mb-1.5 block text-fx-small font-bold text-fx-ink">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls="password"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-fx-muted hover:text-fx-ink"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-fx-action bg-fx-emphasis px-5 py-2.5 text-fx-body font-bold text-fx-emphasis-ink hover:brightness-110 disabled:opacity-60"
          >
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
