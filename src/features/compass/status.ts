import type { Answer, CompassFormWithAnswers } from "./types";

export type CompassStatus = "not_started" | "in_progress" | "completed";

export interface CompassEntry {
  form: CompassFormWithAnswers;
  answer: Answer | null;
  status: CompassStatus;
  /** 0–100, once it is done. */
  score: number | null;
}

/** The most recent answer decides where an organisation stands on a questionnaire. */
export function latestAnswer(form: CompassFormWithAnswers): Answer | null {
  const answers = [...(form.answers ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return answers[0] ?? null;
}

export function compassEntry(form: CompassFormWithAnswers): CompassEntry {
  const answer = latestAnswer(form);
  const status: CompassStatus = !answer ? "not_started" : answer.status === "completed" ? "completed" : "in_progress";
  const score = status === "completed" && answer?.normalized_score != null ? Math.round(answer.normalized_score) : null;
  return { form, answer, status, score };
}

export const STATUS_LABELS: Record<CompassStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

/** How many of them are done — the number the page leads with. */
export function completedCount(entries: CompassEntry[]): number {
  return entries.filter((entry) => entry.status === "completed").length;
}

/** The average of the finished ones, or null while none is. */
export function averageScore(entries: CompassEntry[]): number | null {
  const scores = entries.flatMap((entry) => (entry.score == null ? [] : [entry.score]));
  return scores.length === 0 ? null : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}
