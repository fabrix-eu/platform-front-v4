import { cn } from "@/lib/utils";
import { DATA_AUDIENCES } from "./audiences";

/** Three audiences, one question per line, each answered by the datasets above. */
export function AudienceColumns() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {DATA_AUDIENCES.map((audience) => (
        <div key={audience.title} className="flex flex-col rounded-fx-lg border border-fx-line bg-fx-paper p-5">
          <span className={cn("flex size-11 items-center justify-center rounded-fx", audience.tile)}>
            <audience.icon aria-hidden className="size-5" strokeWidth={2.1} />
          </span>
          <h3 className="mt-4 font-fx-display text-fx-heading text-fx-ink">{audience.title}</h3>
          <p className="mt-2 text-fx-small text-fx-ink2">{audience.blurb}</p>
          <ul className="mt-4 grid gap-3 border-t border-fx-line pt-4">
            {audience.questions.map((q) => (
              <li key={q.lead} className="text-fx-small text-fx-ink2">
                <strong className="text-fx-ink">{q.lead}</strong>: {q.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
