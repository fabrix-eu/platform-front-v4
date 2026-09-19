import { useState } from "react";
import { Compass } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RecommendationItem } from "./RecommendationItem";
import type { Answer } from "./types";

interface Props {
  answer: Answer | null;
  done: number;
  total: number;
  complete: boolean;
}

const SHOWN = 3;

/**
 * Beside the questions, not after them. Answering used to be pure cost — you gave, and
 * the page gave nothing back until you had finished and navigated away.
 *
 * Finished, it carries the result and the advice the answers earned. Unfinished, it says
 * what finishing buys: "four questions left" is a reason to carry on, "7/11" is only a
 * number.
 */
export function ResultPanel({ answer, done, total, complete }: Props) {
  // Ephemeral: whether the strengths below the priorities are unfolded.
  const [showAll, setShowAll] = useState(false);

  const score = answer?.normalized_score;
  const band = answer?.result_band ?? null;
  const all = answer?.recommendations ?? [];
  const priorities = all.filter((item) => !item.strength);
  const strengths = all.filter((item) => item.strength);
  const left = Math.max(total - done, 0);

  if (!complete || score == null) {
    return (
      <aside className="lg:sticky lg:top-8" aria-label="Your progress">
        <Card tone="soft" className="p-5">
          <Eyebrow>Where you are</Eyebrow>
          <p className="mt-3 font-fx-display text-fx-display">
            {done}
            <span className="text-fx-muted">/{total}</span>
          </p>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-fx-line">
            <div
              className="h-full rounded-full bg-fx-emphasis transition-[width] duration-500"
              style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
            />
          </div>

          <p className="mt-4 text-fx-small text-fx-ink2">
            {left === 0
              ? "Everything is answered — your result appears here in a moment."
              : `${left} question${left === 1 ? "" : "s"} left. Finish to see where this organisation stands, and what to do next.`}
          </p>

          <p className="mt-4 flex items-start gap-2 border-t border-fx-line pt-4 text-fx-small text-fx-muted">
            <Compass aria-hidden className="mt-0.5 size-4 shrink-0" />
            Answers save themselves as you go — you can leave and come back.
          </p>
        </Card>
      </aside>
    );
  }

  const shown = showAll ? [...priorities, ...strengths] : priorities.slice(0, SHOWN);
  const hidden = priorities.length + strengths.length - shown.length;

  return (
    <aside className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto" aria-label="Your result">
      <Card className="p-5">
        <Eyebrow>Your result</Eyebrow>
        <p className="mt-2 font-fx-display text-fx-display text-fx-ink">{Math.round(score)}%</p>

        {band && (
          <>
            <h3 className="mt-2 text-fx-heading text-fx-ink">{band.title}</h3>
            {band.body && <p className="mt-2 text-fx-small text-fx-ink2">{band.body}</p>}
          </>
        )}

        {all.length === 0 ? (
          // Scored, but this questionnaire has no advice written against its choices.
          <p className="mt-3 text-fx-small text-fx-ink2">
            Everything is answered and scored. This questionnaire does not carry written guidance yet.
          </p>
        ) : (
          <>
            <Eyebrow className="mt-5 border-t border-fx-line pt-4">
              {priorities.length > 0 ? `What to work on · ${priorities.length}` : `What you are doing well · ${strengths.length}`}
            </Eyebrow>

            <ul className="mt-3 space-y-3">
              {shown.map((item) => (
                <RecommendationItem key={item.question_key} item={item} />
              ))}
            </ul>

            {hidden > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="mt-4 w-full rounded-fx-action border border-fx-line py-2 text-fx-small font-bold text-fx-ink2 hover:border-fx-emphasis hover:text-fx-ink"
              >
                Show {hidden} more
                {priorities.length > shown.length ? "" : `, including what you do well`}
              </button>
            )}
          </>
        )}
      </Card>
    </aside>
  );
}
