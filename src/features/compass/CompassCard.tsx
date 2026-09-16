import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { STATUS_LABELS, type CompassEntry } from "./status";

const TONE = { not_started: "slate", in_progress: "amber", completed: "green" } as const;

/** The score as a ring: a questionnaire is worth 0 to 100. */
function ScoreRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-14 shrink-0" role="img" aria-label={`Score ${score} out of 100`}>
      <svg viewBox="0 0 56 56" className="size-14 -rotate-90">
        <circle cx="28" cy="28" r={radius} fill="none" strokeWidth="5" className="stroke-fx-line" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className={cn(score >= 66 ? "stroke-fx-green" : score >= 33 ? "stroke-fx-amber" : "stroke-fx-rose")}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-fx-small font-bold text-fx-ink">{score}</span>
    </div>
  );
}

export function CompassCard({ entry, orgSlug }: { entry: CompassEntry; orgSlug: string }) {
  const { form, status, score } = entry;
  const label = status === "not_started" ? "Start" : status === "in_progress" ? "Continue" : "Review";

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-fx-heading text-fx-ink">{form.title}</h3>
          <div className="mt-1.5">
            <Badge tone={TONE[status]}>{STATUS_LABELS[status]}</Badge>
          </div>
        </div>
        {score != null && <ScoreRing score={score} />}
      </div>

      {form.description && <p className="mt-3 line-clamp-3 min-h-15 text-fx-small text-fx-ink2">{form.description}</p>}

      <div className="mt-auto pt-4">
        <ButtonLink
          to="/$orgSlug/assessments/$formKey"
          params={{ orgSlug, formKey: form.key }}
          variant={status === "completed" ? "secondary" : "primary"}
          size="sm"
        >
          {label}
          <ArrowRight aria-hidden className="size-4" strokeWidth={2.4} />
        </ButtonLink>
      </div>
    </Card>
  );
}
