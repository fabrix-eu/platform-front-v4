import { useMutation } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { resendVerification } from "./api";
import { submitClass } from "./AuthShell";

const SENT = "A new link is on its way. Open it, then sign in. The previous links no longer work.";

/**
 * "Send the verification email again". With `email` known (the sign-in form), a single
 * button; without, a small form asking for the address. The API answers the same whatever
 * the address, so the success line never says whether an account exists.
 */
export function ResendVerification({ email, reason }: { email?: string; reason?: string }) {
  const mutation = useMutation({ mutationFn: resendVerification });

  if (mutation.isSuccess) {
    return <Banner tone="success">{SENT}</Banner>;
  }

  if (email) {
    return (
      <Banner
        tone="warning"
        action={
          <Button variant="outline" size="sm" disabled={mutation.isPending} onClick={() => mutation.mutate(email)}>
            {mutation.isPending ? "Sending…" : "Send it again"}
          </Button>
        }
      >
        {reason}
      </Banner>
    );
  }

  return (
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
        {mutation.isPending ? "Sending…" : "Send it again"}
      </button>
    </form>
  );
}
