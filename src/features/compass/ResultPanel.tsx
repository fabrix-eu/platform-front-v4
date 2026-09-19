import { Check, Compass } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Answer } from "./types";

interface Props {
  answer: Answer | null;
  done: number;
  total: number;
  complete: boolean;
}

/**
 * Beside the questions, not after them. Answering a questionnaire used to be pure cost —
 * you gave, and the page gave nothing back until you had finished and navigated away.
 *
 * Finished, it carries the result. Unfinished, it says what finishing buys: "four
 * questions left" is a reason to carry on, "7/11" is only a number.
 */
export function ResultPanel({ answer, done, total, complete }: Props) {
  const score = answer?.normalized_score;
  const band = answer?.result_band ?? null;
  const left = Math.max(total - done, 0);

  return (
    <aside className="lg:sticky lg:top-8" aria-label="Your result">
      <Card tone={complete ? "emphasis" : "soft"} className="p-5">
        {complete && score != null ? (
          <>
            <Eyebrow className={complete ? "text-fx-emphasis-ink opacity-75" : undefined}>Your result</Eyebrow>
            <p className="mt-3 font-fx-display text-fx-display">{Math.round(score)}%</p>

            {band ? (
              <>
                <h3 className="mt-3 text-fx-heading">{band.title}</h3>
                {band.body && <p className="mt-2 text-fx-small opacity-85">{band.body}</p>}
                {band.advice && band.advice.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-current/15 pt-4">
                    {band.advice.map((item) => (
                      <li key={item} className="flex gap-2 text-fx-small opacity-85">
                        <Check aria-hidden className="mt-0.5 size-3.5 shrink-0" strokeWidth={3} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              // The scoring exists before the advice does. Say so plainly rather than
              // dress a bare number as a recommendation.
              <p className="mt-3 text-fx-small opacity-85">
                Everything is answered and scored. Guidance for this questionnaire is being written — it
                will appear here.
              </p>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </Card>

      {!complete && answer?.normalized_score != null && (
        <Badge tone="slate" className="mt-3">
          Last scored {Math.round(answer.normalized_score)}%
        </Badge>
      )}
    </aside>
  );
}
