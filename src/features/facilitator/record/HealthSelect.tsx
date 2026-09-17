import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { networkKey } from "../api";
import { HEALTH_LABELS, type NetworkOrganization } from "../types";
import { updateRecord } from "./api";

const DOTS: Record<string, string> = {
  unknown: "bg-fx-line2",
  excellent: "bg-fx-green",
  good: "bg-fx-green",
  warning: "bg-fx-amber",
  critical: "bg-fx-rose",
};

interface HealthSelectProps {
  networkSlug: string;
  record: NetworkOrganization;
  field: "economic_health" | "environmental_score";
  label: string;
}

/** Reads as a status, edits in place — this is the facilitator's own judgement. */
export function HealthSelect({ networkSlug, record, field, label }: HealthSelectProps) {
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: (value: string) => updateRecord(networkSlug, record.id, { [field]: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: networkKey(networkSlug) }),
  });

  const value = record[field];

  return (
    <label className="inline-flex items-center gap-2 text-fx-small text-fx-muted">
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", DOTS[value] ?? "bg-fx-line2")} />
      {label}
      <select
        value={value}
        disabled={save.isPending}
        onChange={(e) => save.mutate(e.currentTarget.value)}
        className="cursor-pointer rounded-fx-sm bg-transparent py-0.5 text-fx-small font-bold text-fx-ink focus:ring-3 focus:ring-fx-emphasis-soft focus:outline-none"
      >
        {Object.entries(HEALTH_LABELS).map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
