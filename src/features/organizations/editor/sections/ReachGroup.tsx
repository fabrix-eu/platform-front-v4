import { useState } from "react";
import { Field } from "@/components/Field";
import type { AnyMutation } from "@/components/FieldError";
import { Badge } from "@/components/ui/Badge";
import type { OrganizationProfile } from "../../types";
import { FormGroup } from "./FormGroup";
import { REACHES } from "./profileOptions";

type ReachName = (typeof REACHES)[number]["name"];

/** The four reach shares as sent: all null when none is filled in. */
export function readReaches(fd: FormData): Record<ReachName, number | null> {
  const values = REACHES.map(({ name }) => String(fd.get(name) ?? "").trim());
  const empty = values.every((v) => v === "");
  return Object.fromEntries(REACHES.map(({ name }, i) => [name, empty ? null : Number(values[i] || 0)])) as Record<ReachName, number | null>;
}

// "Roughly, how far do your customers reach?" — four shares that add up to 100%. The
// running total is shown as you type; the API holds the rule.
export function ReachGroup({ org, mutation }: { org: OrganizationProfile; mutation: AnyMutation }) {
  const initial = REACHES.map(({ name }) => org[name] ?? null);
  // Ephemeral: the shares as typed, only to show the total.
  const [shares, setShares] = useState<(number | null)[]>(initial);
  const total = shares.reduce<number>((sum, v) => sum + (v ?? 0), 0);
  const touched = shares.some((v) => v !== null);

  return (
    <FormGroup
      title="Roughly, how far do your customers reach?"
      description="A self-reported estimate. These are distances, not borders — it helps refine the search."
      aside={<Badge tone="slate">Self-reported</Badge>}
    >
      <div
        className="grid gap-5 sm:grid-cols-4"
        onChange={(e) => {
          const input = e.target as HTMLInputElement;
          const index = REACHES.findIndex(({ name }) => name === input.name);
          if (index < 0) return;
          setShares((prev) => prev.map((v, i) => (i === index ? (input.value.trim() === "" ? null : Number(input.value)) : v)));
        }}
      >
        {REACHES.map((reach, i) => (
          <Field
            key={reach.name}
            label={`${reach.label} %`}
            name={reach.name}
            type="number"
            inputMode="numeric"
            defaultValue={initial[i]?.toString()}
            hint={reach.hint}
            mutation={mutation}
          />
        ))}
      </div>
      {touched && (
        <p className={total === 100 ? "text-fx-small font-bold text-fx-ink2" : "text-fx-small font-bold text-fx-rose"}>
          Total {total}% {total === 100 ? "" : "— the four shares must add up to 100%"}
        </p>
      )}
    </FormGroup>
  );
}
