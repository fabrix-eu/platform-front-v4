import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";
import { roleName, VALUE_CHAIN_STAGES, type Positioned } from "../position";

// Where the organisation sits: the seven stages of the chain in order, its own
// lit up, then the ways it supports the chain.
export function PositionCard({ org }: { org: Positioned }) {
  const stages = org.value_chain_stages ?? [];
  const roles = org.support_roles ?? [];
  if (stages.length === 0 && roles.length === 0) return null;

  return (
    <Card>
      <Eyebrow>In the value chain</Eyebrow>
      {stages.length > 0 && (
        <ol className="mt-4 space-y-1.5">
          {VALUE_CHAIN_STAGES.map((stage) => {
            const on = stages.includes(stage.value);
            return (
              <li
                key={stage.value}
                className={cn(
                  "rounded-fx px-3 py-1.5 text-fx-small",
                  on ? "bg-fx-emphasis-soft font-bold text-fx-ink" : "text-fx-muted",
                )}
              >
                {stage.label}
              </li>
            );
          })}
        </ol>
      )}
      {roles.length > 0 && (
        <>
          <p className="mt-5 text-fx-small font-bold text-fx-ink2">Supports the chain</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {roles.map((role) => (
              <span key={role} className="rounded-full bg-fx-slate-soft px-3 py-1 text-fx-small font-bold text-fx-ink2">
                {roleName(role, org.support_roles_other)}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
