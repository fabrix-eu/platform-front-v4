import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { createTask, deleteTask, networkKey, networkTasksQueryOptions, setTaskDone } from "../api";
import { TaskRow } from "../TaskRow";

/** What is still to do about this organisation — the same tasks as the network's
 *  list, narrowed to the ones attached to this record. */
export function RecordTasksCard({ networkSlug, recordId }: { networkSlug: string; recordId: string }) {
  const queryClient = useQueryClient();
  // Ephemeral: which half of this card's list is showing.
  const [filter, setFilter] = useState<"open" | "done">("open");

  const query = useQuery(networkTasksQueryOptions(networkSlug, filter, recordId));

  const refresh = () => queryClient.invalidateQueries({ queryKey: networkKey(networkSlug) });
  const add = useMutation({
    mutationFn: (task: { title: string; due_on?: string }) =>
      createTask(networkSlug, { ...task, network_organization_id: recordId }),
    onSuccess: refresh,
  });
  const toggle = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => setTaskDone(networkSlug, id, done),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: (id: string) => deleteTask(networkSlug, id), onSuccess: refresh });

  const tasks = query.data?.data ?? [];

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Eyebrow>Tasks</Eyebrow>
        <div className="flex gap-2">
          <Pill role="radio" aria-checked={filter === "open"} selected={filter === "open"} onClick={() => setFilter("open")}>
            To do
          </Pill>
          <Pill role="radio" aria-checked={filter === "done"} selected={filter === "done"} onClick={() => setFilter("done")}>
            Done
          </Pill>
        </div>
      </div>

      <form
        className="mt-3 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          const title = String(fd.get("title") ?? "").trim();
          if (!title) return;
          add.mutate({ title, due_on: String(fd.get("due_on") ?? "") || undefined }, { onSuccess: () => form.reset() });
        }}
      >
        <input name="title" required placeholder="Add a task about them…" aria-label="Task" className={cn(inputClass, "min-w-40 flex-1 px-3 py-2")} />
        <input name="due_on" type="date" aria-label="Due date" className={cn(inputClass, "w-auto px-3 py-2")} />
        <Button type="submit" disabled={add.isPending}>
          {add.isPending ? "Adding…" : "Add"}
        </Button>
      </form>

      {query.isError ? (
        <Banner tone="danger" className="mt-4">These tasks could not be loaded.</Banner>
      ) : query.isPending ? (
        <p className="mt-4 text-fx-small text-fx-muted">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="mt-4 text-fx-body text-fx-ink2">
          {filter === "open" ? "Nothing to do about them right now." : "Nothing completed yet."}
        </p>
      ) : (
        <ul className="mt-4 overflow-hidden rounded-fx border border-fx-line">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              showOrganisation={false}
              onToggle={() => toggle.mutate({ id: task.id, done: !task.done_at })}
              onRemove={() => remove.mutate(task.id)}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
