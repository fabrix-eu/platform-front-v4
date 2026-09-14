import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type Relation = "mine" | "partner";

const OPTIONS = [
  {
    value: "mine" as const,
    icon: Building2,
    title: "It's my organisation",
    text: "I work there. I create its profile and manage it.",
  },
  {
    value: "partner" as const,
    icon: Handshake,
    title: "It's a partner I work with",
    text: "A supplier, a client, a recycler… I add it, and FABRIX invites them to claim it.",
  },
];

export function RelationStep({ name, onBack, onContinue }: { name: string; onBack: () => void; onContinue: (relation: Relation) => void }) {
  // Ephemeral: the option highlighted before continuing.
  const [relation, setRelation] = useState<Relation | null>(null);

  return (
    <div className="space-y-6">
      <div role="radiogroup" aria-label={`Your relation to ${name}`} className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map(({ value, icon: Icon, title, text }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={relation === value}
            onClick={() => setRelation(value)}
            className={cn(
              "flex flex-col items-start gap-3 rounded-fx border-2 p-5 text-left transition",
              relation === value ? "border-fx-emphasis bg-fx-emphasis-soft" : "border-fx-line bg-fx-paper hover:border-fx-line2",
            )}
          >
            <Icon aria-hidden className="size-6 text-fx-emphasis" />
            <span className="text-fx-heading text-fx-ink">{title}</span>
            <span className="text-fx-small text-fx-ink2">{text}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-3 border-t border-fx-line pt-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button disabled={!relation} onClick={() => relation && onContinue(relation)}>
          Continue
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
