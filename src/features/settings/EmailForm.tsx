import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/auth";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { updateMe } from "./api";

export function EmailForm({ me }: { me: User }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const save = useMutation({
    mutationFn: updateMe,
    meta: { silentErrors: true },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast(result.message);
    },
  });

  return (
    <section className="max-w-xl">
      <h2 className="text-fx-heading text-fx-ink">Email</h2>

      <Banner tone="info" className="mt-4">
        Changing your email signs you out of nothing, but you will have to verify the new address before
        FABRIX writes to it again.
      </Banner>

      <form
        className="mt-5 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          save.mutate(
            {
              email: String(fd.get("email") ?? "").trim(),
              current_password: String(fd.get("current_password") ?? ""),
            },
            { onSuccess: () => form.reset() },
          );
        }}
      >
        <FormError mutation={save} fields={["email", "current_password"]} />
        <Field label="New email" name="email" type="email" required autoComplete="email" defaultValue={me.email} mutation={save} />
        <Field
          label="Current password"
          name="current_password"
          type="password"
          required
          autoComplete="current-password"
          hint="Asked for because this changes how you sign in."
          mutation={save}
        />
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Change email"}
        </Button>
      </form>
    </section>
  );
}
