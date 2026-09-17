import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClass } from "@/components/Field";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { createTask, deleteTask, networkKey, networkTasksQueryOptions, setTaskDone } from "./api";
import type { Network, NetworkTask } from "./types";

const startOfToday = () => new Date(new Date().toDateString());

const dueLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

interface TasksTabProps {
  network: Network;
  filter: "open" | "done";
  onFilterChange: (filter: "open" | "done") => void;
}

export function TasksTab({ network, filter, onFilterChange }: TasksTabProps) {
  const queryClient = useQueryClient();
  const query = useQuery(networkTasksQueryOptions(network.slug, filter));

  const refresh = () => queryClient.invalidateQueries({ queryKey: networkKey(network.slug) });
  const add = useMutation({ mutationFn: (task: Parameters<typeof createTask>[1]) => createTask(network.slug, task), onSuccess: refresh });
  const toggle = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => setTaskDone(network.slug, id, done),
    onSuccess: refresh,
  });
  const remove = useMutation({ mutationFn: (id: string) => deleteTask(network.slug, id), onSuccess: refresh });

  const tasks = query.data?.data ?? [];

  return (
    <div className="mt-8 max-w-3xl">
      <Card className="p-5">
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            const title = String(fd.get("title") ?? "").trim();
            if (!title) return;
            add.mutate({ title, due_on: String(fd.get("due_on") ?? "") || undefined }, { onSuccess: () => form.reset() });
          }}
        >
          <input name="title" required placeholder="Add a task…" aria-label="Task" className={cn(inputClass, "min-w-40 flex-1")} />
          <input name="due_on" type="date" aria-label="Due date" className={cn(inputClass, "w-auto")} />
          <Button type="submit" disabled={add.isPending}>
            {add.isPending ? "Adding…" : "Add"}
          </Button>
        </form>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <Pill role="radio" aria-checked={filter === "open"} selected={filter === "open"} onClick={() => onFilterChange("open")}>
          To do
        </Pill>
        <Pill role="radio" aria-checked={filter === "done"} selected={filter === "done"} onClick={() => onFilterChange("done")}>
          Done
        </Pill>
      </div>

      {query.isError ? (
        <Banner tone="danger" className="mt-4">These tasks could not be loaded.</Banner>
      ) : query.isPending ? (
        <p className="mt-4 text-fx-small text-fx-muted">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="mt-4 text-fx-body text-fx-ink2">{filter === "open" ? "Nothing to do — enjoy." : "No completed task yet."}</p>
      ) : (
        <ul className="mt-4 overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggle.mutate({ id: task.id, done: !task.done_at })}
              onRemove={() => remove.mutate(task.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskRow({ task, onToggle, onRemove }: { task: NetworkTask; onToggle: () => void; onRemove: () => void }) {
  const done = !!task.done_at;
  const overdue = !done && task.due_on && new Date(task.due_on) < startOfToday();

  return (
    <li className="group flex items-center gap-3 border-t border-fx-line px-4 py-3 first:border-t-0">
      <input
        type="checkbox"
        checked={done}
        onChange={onToggle}
        aria-label={`Mark "${task.title}" as ${done ? "to do" : "done"}`}
        className="size-4 shrink-0 accent-fx-emphasis"
      />
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-fx-small", done ? "text-fx-muted line-through" : "text-fx-ink")}>{task.title}</span>
        <span className="mt-0.5 flex flex-wrap gap-2 text-fx-label text-fx-muted">
          {task.due_on && <span className={cn(overdue && "font-bold text-fx-rose")}>{dueLabel(task.due_on)}</span>}
          {task.organization && <span className="truncate">{task.organization.name}</span>}
        </span>
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Delete "${task.title}"`}
        className="shrink-0 rounded-fx-action p-1.5 text-fx-muted opacity-0 transition hover:bg-fx-panel hover:text-fx-rose focus-visible:opacity-100 group-hover:opacity-100"
      >
        <Trash2 aria-hidden className="size-4" />
      </button>
    </li>
  );
}
