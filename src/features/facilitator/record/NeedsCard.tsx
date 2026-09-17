import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Toggles";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { networkKey } from "../api";
import type { NetworkOrganization } from "../types";
import { updateRecord } from "./api";
import { asNeeds, NEED_OPTIONS, type Needs } from "./needs";

/** What this organisation needs, as assessed by the facilitator — not by the organisation. */
export function NeedsCard({ networkSlug, record }: { networkSlug: string; record: NetworkOrganization }) {
  const queryClient = useQueryClient();
  const [needs, setNeeds] = useState<Needs>(asNeeds(record.needs));
  // Ephemeral: the whole list shows while assessing, only the chosen ones after.
  const [editing, setEditing] = useState(false);

  const save = useMutation({
    mutationFn: (next: Needs) => updateRecord(networkSlug, record.id, { needs: next }),
    onError: () => setNeeds(asNeeds(record.needs)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: networkKey(networkSlug) }),
  });

  const toggle = (key: string) => {
    const next: Needs = { ...needs, [key]: { selected: !needs[key]?.selected, note: needs[key]?.note ?? "" } };
    setNeeds(next);
    save.mutate(next);
  };

  const selected = NEED_OPTIONS.filter((option) => needs[option.key]?.selected);
  const visible = editing ? NEED_OPTIONS : selected;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>Needs{selected.length > 0 ? ` · ${selected.length}` : ""}</Eyebrow>
        <Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}>
          {editing ? "Done" : "Assess"}
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="mt-3 text-fx-body text-fx-ink2">No need identified yet — use “Assess”.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {visible.map((option) => {
            const isSelected = !!needs[option.key]?.selected;
            return (
              <li key={option.key}>
                {editing ? (
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggle(option.key)}
                    label={
                      <span>
                        <span className="block text-fx-small font-bold text-fx-ink">{option.label}</span>
                        <span className="block text-fx-label text-fx-muted">{option.description}</span>
                      </span>
                    }
                  />
                ) : (
                  <p className="text-fx-small font-bold text-fx-ink">{option.label}</p>
                )}
                {isSelected && (
                  <input
                    type="text"
                    value={needs[option.key]?.note ?? ""}
                    aria-label={`Note about ${option.label}`}
                    placeholder="Add a note…"
                    onChange={(e) => setNeeds((prev) => ({ ...prev, [option.key]: { selected: true, note: e.currentTarget.value } }))}
                    onBlur={() => save.mutate(needs)}
                    className="mt-1 w-full border-b border-transparent bg-transparent pb-0.5 text-fx-small text-fx-ink2 placeholder:text-fx-muted focus:border-fx-line2 focus:outline-none"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
