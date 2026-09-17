import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CONTACT_KINDS } from "../types";
import { contactPointsQueryOptions, createContactPoint, deleteContactPoint, recordKey } from "./api";

const when = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** The history of what was said and done with this organisation. */
export function InteractionsCard({ networkSlug, recordId }: { networkSlug: string; recordId: string }) {
  const queryClient = useQueryClient();
  const query = useQuery(contactPointsQueryOptions(networkSlug, recordId));

  const refresh = () => queryClient.invalidateQueries({ queryKey: recordKey(networkSlug, recordId) });
  const log = useMutation({
    mutationFn: (point: Parameters<typeof createContactPoint>[2]) => createContactPoint(networkSlug, recordId, point),
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: (pointId: string) => deleteContactPoint(networkSlug, recordId, pointId),
    onSuccess: refresh,
  });

  const points = query.data ?? [];
  const field = cn(inputClass, "px-3 py-2");

  return (
    <Card className="p-5">
      <Eyebrow>Interactions</Eyebrow>

      <form
        className="mt-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          const summary = String(fd.get("summary") ?? "").trim();
          if (!summary) return;
          log.mutate(
            { kind: String(fd.get("kind") ?? "other"), occurred_at: String(fd.get("occurred_at") ?? "") || undefined, summary },
            { onSuccess: () => form.reset() },
          );
        }}
      >
        <select name="kind" defaultValue="call" aria-label="Kind" className={cn(field, "w-auto")}>
          {Object.entries(CONTACT_KINDS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <input name="occurred_at" type="date" aria-label="When" className={cn(field, "w-auto")} />
        <input name="summary" required placeholder="What happened?" aria-label="Summary" className={cn(field, "min-w-40 flex-1")} />
        <Button type="submit" disabled={log.isPending}>
          {log.isPending ? "Logging…" : "Log"}
        </Button>
      </form>

      {query.isPending ? (
        <p className="mt-4 text-fx-small text-fx-muted">Loading…</p>
      ) : points.length === 0 ? (
        <p className="mt-4 text-fx-body text-fx-ink2">No interaction logged yet.</p>
      ) : (
        <ul className="mt-4">
          {points.map((point) => (
            <li key={point.id} className="group flex items-start gap-3 border-t border-fx-line py-3 first:border-t-0">
              <span className="min-w-0 flex-1">
                <span className="block text-fx-small text-fx-ink">{point.summary}</span>
                <span className="mt-0.5 block text-fx-label text-fx-muted">
                  {CONTACT_KINDS[point.kind] ?? point.kind} · {when(point.occurred_at)}
                  {point.author && ` · ${point.author.name}`}
                </span>
              </span>
              <button
                type="button"
                onClick={() => remove.mutate(point.id)}
                aria-label="Delete this interaction"
                className="shrink-0 rounded-fx-action p-1.5 text-fx-muted opacity-0 transition hover:bg-fx-panel hover:text-fx-rose focus-visible:opacity-100 group-hover:opacity-100"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
