import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { networkKey } from "../api";
import type { NetworkOrganization } from "../types";
import { updateRecord } from "./api";

/** The facilitator's working memory about this organisation — saved on its own. */
export function NotesCard({ networkSlug, record }: { networkSlug: string; record: NetworkOrganization }) {
  const queryClient = useQueryClient();
  // Stateful by nature: what is typed is saved shortly after it stops changing.
  const [notes, setNotes] = useState(record.notes ?? "");

  const save = useMutation({
    mutationFn: (value: string) => updateRecord(networkSlug, record.id, { notes: value }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: networkKey(networkSlug) }),
  });

  // The mutation object changes identity on every render — including the renders a
  // save itself causes. Kept in a ref, it cannot make the effect below save twice.
  const saveRef = useRef(save);
  saveRef.current = save;
  const lastSaved = useRef(record.notes ?? "");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (notes === lastSaved.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastSaved.current = notes;
      saveRef.current.mutate(notes);
    }, 800);
    return () => clearTimeout(timer.current);
  }, [notes]);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>Notes</Eyebrow>
        <span className="text-fx-label text-fx-muted" aria-live="polite">
          {save.isPending ? "Saving…" : save.isError ? "Could not save" : save.isSuccess ? "Saved" : ""}
        </span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        rows={Math.min(10, Math.max(3, notes.split("\n").length + 1))}
        aria-label="Notes about this organisation"
        placeholder="Anything your team should know about this organisation…"
        className="mt-2 w-full resize-none bg-transparent text-fx-body leading-relaxed text-fx-ink placeholder:text-fx-muted focus:outline-none"
      />
    </Card>
  );
}
