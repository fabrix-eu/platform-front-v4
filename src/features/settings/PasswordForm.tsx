import { useMutation } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { updateMe } from "./api";

export function PasswordForm() {
  const { toast } = useToast();
  const save = useMutation({ mutationFn: updateMe, meta: { silentErrors: true } });

  return (
    <section className="max-w-xl">
      <h2 className="text-fx-heading text-fx-ink">Password</h2>

      <form
        className="mt-5 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          save.mutate(
            {
              current_password: String(fd.get("current_password") ?? ""),
              password: String(fd.get("password") ?? ""),
              password_confirmation: String(fd.get("password_confirmation") ?? ""),
            },
            {
              onSuccess: () => {
                form.reset();
                toast("Password changed");
              },
            },
          );
        }}
      >
        <FormError mutation={save} fields={["current_password", "password", "password_confirmation"]} />
        <Field label="Current password" name="current_password" type="password" required autoComplete="current-password" mutation={save} />
        <Field label="New password" name="password" type="password" required autoComplete="new-password" mutation={save} />
        <Field
          label="Confirm new password"
          name="password_confirmation"
          type="password"
          required
          autoComplete="new-password"
          mutation={save}
        />
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Change password"}
        </Button>
      </form>
    </section>
  );
}
