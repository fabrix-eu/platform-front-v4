import { CheckCircle2, Plus } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";

export type Outcome = { kind: "claim"; name: string } | { kind: "partner"; name: string; invited?: string };

export function DoneStep({ outcome, onAddAnother }: { outcome: Outcome; onAddAnother: () => void }) {
  const text =
    outcome.kind === "claim"
      ? `Your claim on ${outcome.name} is sent. The FABRIX team reviews it and lets you know — then the profile is yours to manage.`
      : outcome.invited
        ? `${outcome.name} is on FABRIX. We invited ${outcome.invited} to claim its profile.`
        : `${outcome.name} is on FABRIX. When you know who runs it, add them from its profile so they can claim it.`;

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <CheckCircle2 aria-hidden className="size-12 text-fx-green" strokeWidth={1.75} />
      <p className="mt-5 text-fx-title text-fx-ink">{outcome.kind === "claim" ? "Claim sent" : "Partner added"}</p>
      <p className="mt-3 max-w-md text-fx-body text-fx-ink2">{text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {outcome.kind === "partner" && (
          <Button onClick={onAddAnother}>
            <Plus className="size-4" strokeWidth={2.6} />
            Add another partner
          </Button>
        )}
        <ButtonLink to="/" variant={outcome.kind === "partner" ? "ghost" : "primary"}>
          Back home
        </ButtonLink>
      </div>
    </div>
  );
}
