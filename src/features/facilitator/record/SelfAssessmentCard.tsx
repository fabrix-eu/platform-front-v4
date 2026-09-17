import { useQuery } from "@tanstack/react-query";
import { compassFormQueryOptions, latestAnswerQueryOptions } from "@/features/compass/api";
import { isVisible } from "@/features/compass/visibility";
import type { Question } from "@/features/compass/types";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

const FORM_KEY = "needs-opportunities";

const RATING_LABELS: Record<number, string> = {
  1: "Not at all",
  2: "Slightly",
  3: "Moderately",
  4: "Very",
  5: "Extremely",
};

function Answered({ question, response }: { question: Question; response: unknown }) {
  if (question.field_type === "table") {
    const values = (response as Record<string, unknown>) ?? {};
    const rows = (question.options.rows ?? []).filter((row) => Number(values[row.value]) > 0);
    if (rows.length === 0) return null;

    return (
      <div>
        <Eyebrow>{question.text}</Eyebrow>
        <ul className="mt-2">
          {rows.map((row) => {
            const score = Number(values[row.value]);
            return (
              <li key={row.value} className="flex items-center justify-between gap-3 border-t border-fx-line py-2 first:border-t-0">
                <span className="min-w-0 text-fx-small text-fx-ink2">{row.label}</span>
                <Badge tone="violet">{`${score} · ${RATING_LABELS[score] ?? ""}`}</Badge>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const text = typeof response === "string" ? response.trim() : "";
  if (!text) return null;

  return (
    <div>
      <Eyebrow>{question.text}</Eyebrow>
      <p className="mt-1.5 whitespace-pre-line text-fx-body text-fx-ink2">{text}</p>
    </div>
  );
}

/**
 * The organisation's own "Needs & opportunities" answers. Read-only on purpose:
 * only the organisation edits them, the facilitator consults them. Sits next to
 * the facilitator's own needs assessment, which is a different thing entirely.
 */
export function SelfAssessmentCard({ organizationId }: { organizationId: string }) {
  const form = useQuery(compassFormQueryOptions(FORM_KEY));
  const answer = useQuery({ ...latestAnswerQueryOptions(form.data?.id ?? "", organizationId), enabled: !!form.data?.id });

  const responses = (answer.data?.responses ?? {}) as Record<string, unknown>;
  const questions = (form.data?.sections ?? [])
    .flatMap((section) => section.questions)
    .filter((question) => isVisible(question, responses));

  const blocks = questions.map((question) => ({ question, response: responses[question.key] }));
  const anyAnswer = Object.keys(responses).length > 0;

  return (
    <Card className="p-5">
      <Eyebrow>Self-assessment</Eyebrow>
      <p className="mt-1 text-fx-label text-fx-muted">The organisation’s own needs form — you can read it, only they can change it.</p>

      {form.isPending || answer.isPending ? (
        <p className="mt-3 text-fx-small text-fx-muted">Loading…</p>
      ) : !anyAnswer ? (
        <p className="mt-3 text-fx-body text-fx-ink2">They have not filled it in yet.</p>
      ) : (
        <div className="mt-4 space-y-5">
          {blocks.map(({ question, response }) => (
            <Answered key={question.id} question={question} response={response} />
          ))}
        </div>
      )}
    </Card>
  );
}
