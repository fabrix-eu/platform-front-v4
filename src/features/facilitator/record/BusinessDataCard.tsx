import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { inputClass, labelClass } from "@/components/Field";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { networkKey } from "../api";
import type { NetworkOrganization } from "../types";
import { updateRecord, type RecordPatch } from "./api";

/** Figures the network keeps for itself — the public profile never shows them. */
export function BusinessDataCard({ networkSlug, record }: { networkSlug: string; record: NetworkOrganization }) {
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: (patch: RecordPatch) => updateRecord(networkSlug, record.id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: networkKey(networkSlug) }),
  });

  // Saved on blur, and only when the value actually moved.
  const saveNumber = (field: "annual_turnover" | "number_of_employees" | "growth_rate", raw: string, current: unknown) => {
    const next = raw === "" ? null : Number(raw);
    const before = current === null || current === undefined || current === "" ? null : Number(current);
    if (next !== before) save.mutate({ [field]: next });
  };

  const field = cn(inputClass, "px-3 py-2");

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>Business data</Eyebrow>
        <span className="text-fx-label text-fx-muted" aria-live="polite">{save.isPending ? "Saving…" : ""}</span>
      </div>

      <div className="mt-3 space-y-4">
        <div>
          <label htmlFor="specialization" className={labelClass}>Specialisation</label>
          <input
            id="specialization"
            defaultValue={record.specialization ?? ""}
            onBlur={(e) => {
              if (e.currentTarget.value !== (record.specialization ?? "")) save.mutate({ specialization: e.currentTarget.value });
            }}
            className={field}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="annual_turnover" className={labelClass}>Turnover €</label>
            <input
              id="annual_turnover"
              type="number"
              step="0.01"
              defaultValue={record.annual_turnover ?? ""}
              onBlur={(e) => saveNumber("annual_turnover", e.currentTarget.value, record.annual_turnover)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="number_of_employees" className={labelClass}>Employees</label>
            <input
              id="number_of_employees"
              type="number"
              defaultValue={record.number_of_employees ?? ""}
              onBlur={(e) => saveNumber("number_of_employees", e.currentTarget.value, record.number_of_employees)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="growth_rate" className={labelClass}>Growth %</label>
            <input
              id="growth_rate"
              type="number"
              step="0.01"
              defaultValue={record.growth_rate ?? ""}
              onBlur={(e) => saveNumber("growth_rate", e.currentTarget.value, record.growth_rate)}
              className={field}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
