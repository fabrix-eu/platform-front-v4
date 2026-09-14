import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Plus } from "lucide-react";
import { useDebounced } from "@/lib/useDebounced";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { organizationSearchQueryOptions } from "../api";
import { orgKindLabel } from "../kinds";
import type { OrganizationSummary } from "../types";

interface OrgSearchStepProps {
  onPick: (organization: OrganizationSummary) => void;
  onCreate: (name: string) => void;
  placeholder?: string;
  /** Under the results — e.g. "I'm not part of an organisation". */
  footer?: ReactNode;
}

const ROW = "flex w-full items-center gap-3 rounded-fx border p-3 text-left transition focus-visible:ring-3 focus-visible:ring-fx-emphasis-soft focus-visible:outline-none";

// Search first, create last: the organisation may already be on FABRIX, waiting to be claimed.
export function OrgSearchStep({ onPick, onCreate, placeholder = "Type your organisation's name", footer }: OrgSearchStepProps) {
  // Ephemeral: what is being typed (a wizard step, not a shareable view).
  const [term, setTerm] = useState("");
  const debounced = useDebounced(term.trim(), 300);
  const query = useQuery(organizationSearchQueryOptions(debounced));
  const ready = debounced.length >= 2;

  return (
    <div className="space-y-5">
      <SearchInput autoFocus value={term} onChange={(e) => setTerm(e.currentTarget.value)} placeholder={placeholder} aria-label="Organisation name" />

      {!ready ? (
        <p className="text-fx-small text-fx-muted">Type at least two letters. If it is already on FABRIX, you can claim it instead of creating it again.</p>
      ) : (
        <ul className="space-y-2" aria-busy={query.isFetching}>
          {query.isPending && <li className="text-fx-small text-fx-muted">Searching…</li>}
          {query.data?.map((org) => (
            <li key={org.id}>
              <button type="button" onClick={() => onPick(org)} className={`${ROW} border-fx-line bg-fx-paper hover:border-fx-emphasis`}>
                <Avatar name={org.name} src={org.image_url} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-fx-body font-bold text-fx-ink">{org.name}</span>
                  <span className="block truncate text-fx-small text-fx-muted">
                    {[orgKindLabel(org.kind), org.address].filter(Boolean).join(" · ")}
                  </span>
                </span>
                {org.claimed ? <Badge tone="slate">Managed</Badge> : <Badge tone="violet">Claimable</Badge>}
                <ChevronRight aria-hidden className="size-4 shrink-0 text-fx-muted" />
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={() => onCreate(debounced)} className={`${ROW} border-2 border-dashed border-fx-line2 hover:border-fx-emphasis`}>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-fx bg-fx-emphasis-soft text-fx-emphasis">
                <Plus className="size-5" strokeWidth={2.6} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-fx-body font-bold text-fx-ink">Create “{debounced}”</span>
                <span className="block text-fx-small text-fx-muted">
                  {query.data?.length ? "None of these — it is not on FABRIX yet" : "No match — it is not on FABRIX yet"}
                </span>
              </span>
              <ChevronRight aria-hidden className="size-4 shrink-0 text-fx-muted" />
            </button>
          </li>
        </ul>
      )}

      {footer}
    </div>
  );
}
