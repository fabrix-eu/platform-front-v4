import { useMutation } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { FormError } from "@/components/FieldError";
import { Button } from "@/components/ui/Button";
import { toastBus } from "@/lib/toastBus";
import { FEEDBACK_CATEGORIES, submitFeedback } from "./api";
import { ScreenshotField } from "./ScreenshotField";

const FIELDS = ["category", "message"];

export function FeedbackForm({ onSent }: { onSent: () => void }) {
  // The screen they are on, captured at send time rather than asked for.
  const path = useRouterState({ select: (s) => s.location.href });

  const send = useMutation({
    mutationFn: (fd: FormData) => {
      const screenshot = fd.get("screenshot");
      return submitFeedback({
        category: String(fd.get("category")),
        message: String(fd.get("message")),
        context_path: path,
        screenshot: screenshot instanceof File && screenshot.size > 0 ? screenshot : null,
      });
    },
    // The form shows its own field errors; the global handler would double up.
    meta: { silentErrors: true },
    onSuccess: () => {
      toastBus.emit("Thanks — your feedback reached the team.");
      onSent();
    },
  });

  return (
    <form
      id="feedback-form"
      onSubmit={(e) => {
        e.preventDefault();
        send.mutate(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      <FormError mutation={send} fields={FIELDS} />

      <SelectField
        label="What is this about?"
        name="category"
        mutation={send}
        options={FEEDBACK_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
        defaultValue="bug"
        required
      />

      <TextareaField
        label="Tell us"
        name="message"
        mutation={send}
        rows={4}
        required
        placeholder="What happened, and what you expected instead."
      />

      <ScreenshotField />

      <p className="text-fx-small text-fx-muted">
        We record the page you are on: <span className="break-all text-fx-ink2">{path}</span>
      </p>

      <Button type="submit" disabled={send.isPending} className="w-full">
        {send.isPending ? "Sending…" : "Send feedback"}
      </Button>
    </form>
  );
}
