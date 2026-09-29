import { Badge } from "@/components/ui/Badge";
import type { DataSummary } from "./api";
import { coverage, DATASETS, STATUS_LABELS } from "./datasets";

const STATUS_TONE = { members: "green", returning: "amber", platform: "violet" } as const;

/** One card per dataset: source, territory, what it holds, what is not in it. */
export function DatasetCards({ summary }: { summary: DataSummary }) {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {DATASETS.map((dataset) => (
        <article key={dataset.key} className="flex flex-col rounded-fx-lg border border-fx-line bg-fx-paper p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={dataset.tone}>{dataset.source}</Badge>
            <Badge tone={STATUS_TONE[dataset.status]}>{STATUS_LABELS[dataset.status]}</Badge>
          </div>
          <h3 className="mt-4 font-fx-display text-fx-heading text-fx-ink">{dataset.label}</h3>
          <p className="mt-1 text-fx-small text-fx-muted">{dataset.territory}</p>
          <p className="mt-3 font-fx-display text-fx-body font-bold text-fx-ink tabular-nums">{coverage(dataset, summary)}</p>
          <p className="mt-3 text-fx-small text-fx-ink2">{dataset.covers}</p>
          <dl className="mt-4 grid gap-2 border-t border-fx-line pt-4 text-fx-small">
            <div>
              <dt className="font-bold text-fx-ink">In it</dt>
              <dd className="text-fx-ink2">{dataset.fields}</dd>
            </div>
            <div>
              <dt className="font-bold text-fx-ink">Not in it</dt>
              <dd className="text-fx-ink2">{dataset.notIn}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
