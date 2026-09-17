import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NetworkTask } from "./types";

const startOfToday = () => new Date(new Date().toDateString());

const dueLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

interface TaskRowProps {
  task: NetworkTask;
  onToggle: () => void;
  onRemove: () => void;
  /** The sheet already says which organisation this is about. */
  showOrganisation?: boolean;
}

/** One task, shared by the network's list and an organisation's own section. */
export function TaskRow({ task, onToggle, onRemove, showOrganisation = true }: TaskRowProps) {
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
          {showOrganisation && task.organization && <span className="truncate">{task.organization.name}</span>}
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
