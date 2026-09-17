import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/Card";
import { networkOrganizationsCountQueryOptions, networkTasksQueryOptions } from "./api";
import type { Network } from "./types";

function Kpi({ label, value, tone }: { label: string; value: number | string; tone?: "alert" }) {
  return (
    <Card className="p-5">
      <p className="text-fx-small text-fx-ink2">{label}</p>
      <p className={`mt-1 font-fx-display text-fx-display ${tone === "alert" ? "text-fx-rose" : "text-fx-ink"}`}>{value}</p>
    </Card>
  );
}

const startOfToday = () => new Date(new Date().toDateString());

export function OverviewTab({ network }: { network: Network }) {
  const count = useQuery(networkOrganizationsCountQueryOptions(network.slug));
  const openTasks = useQuery(networkTasksQueryOptions(network.slug, "open"));

  const tasks = openTasks.data?.data ?? [];
  const overdue = tasks.filter((task) => task.due_on && new Date(task.due_on) < startOfToday()).length;

  return (
    <div className="mt-8">
      {network.description && <p className="max-w-3xl text-fx-body text-fx-ink2">{network.description}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link to="/facilitator/$networkSlug" params={{ networkSlug: network.slug }} search={{ tab: "organisations" }}>
          <Kpi label="Organisations followed" value={count.data ?? "—"} />
        </Link>
        <Link to="/facilitator/$networkSlug" params={{ networkSlug: network.slug }} search={{ tab: "tasks" }}>
          <Kpi label="Open tasks" value={openTasks.data?.meta.total_count ?? "—"} />
        </Link>
        <Kpi label="Overdue" value={overdue} tone={overdue > 0 ? "alert" : undefined} />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-fx-heading text-fx-ink">Next up</h2>
          {openTasks.isPending ? (
            <p className="mt-3 text-fx-small text-fx-muted">Loading…</p>
          ) : tasks.length === 0 ? (
            <p className="mt-3 text-fx-body text-fx-ink2">Nothing to do — enjoy.</p>
          ) : (
            <ul className="mt-3">
              {tasks.slice(0, 6).map((task) => (
                <li key={task.id} className="flex items-baseline justify-between gap-3 border-t border-fx-line py-2.5 first:border-t-0">
                  <span className="min-w-0 flex-1 truncate text-fx-small text-fx-ink">{task.title}</span>
                  {task.organization && <span className="shrink-0 text-fx-label text-fx-muted">{task.organization.name}</span>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-fx-heading text-fx-ink">Territory</h2>
          <dl className="mt-3 space-y-2 text-fx-small">
            <div className="flex justify-between gap-3 border-t border-fx-line py-2 first:border-t-0">
              <dt className="text-fx-muted">Centre</dt>
              <dd className="text-right text-fx-ink2">{network.center_address ?? "Not set"}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-fx-line py-2">
              <dt className="text-fx-muted">Radius</dt>
              <dd className="text-fx-ink2">{network.radius_km ? `${network.radius_km} km` : "Not set"}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-fx-line py-2">
              <dt className="text-fx-muted">Run by</dt>
              <dd className="text-fx-ink2">{network.organization?.name ?? "—"}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
