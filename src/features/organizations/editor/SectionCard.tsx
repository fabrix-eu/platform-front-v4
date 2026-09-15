import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Contrast, ImageIcon, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { EditorSection, SectionStatus } from "./completion";

const STATUS: Record<SectionStatus, { label: string; border: string; badge: "green" | "violet" | "slate" }> = {
  complete: { label: "Complete", border: "border-l-fx-green", badge: "green" },
  partial: { label: "Partially complete", border: "border-l-fx-emphasis", badge: "violet" },
  not_started: { label: "Not started", border: "border-l-fx-line2", badge: "slate" },
  private: { label: "Private", border: "border-l-fx-line2", badge: "slate" },
};

function StatusIcon({ section }: { section: EditorSection }) {
  const base = "flex size-9 shrink-0 items-center justify-center rounded-full";
  if (section.status === "complete") return <span className={cn(base, "bg-fx-green text-fx-on-accent")}><Check className="size-4" strokeWidth={3} /></span>;
  if (section.status === "partial") return <span className={cn(base, "bg-fx-emphasis-soft text-fx-emphasis")}><Contrast className="size-4" /></span>;
  if (section.status === "private") return <span className={cn(base, "bg-fx-slate-soft text-fx-ink2")}><Lock className="size-4" /></span>;
  return (
    <span className={cn(base, "border-2 border-fx-line2 font-fx-display text-fx-small font-extrabold text-fx-muted")}>
      {section.letter ?? <ImageIcon aria-hidden className="size-4" />}
    </span>
  );
}

interface SectionCardProps {
  section: EditorSection;
  orgSlug: string;
  open: boolean;
}

// One collapsible section. Its open state is the `section` search param, so a section
// can be linked to ("Finish your profile" opens the first one left).
export function SectionCard({ section, orgSlug, open }: SectionCardProps) {
  const status = STATUS[section.status];
  const title = section.letter ? `${section.letter} · ${section.title}` : section.title;

  return (
    <div id={`section-${section.key}`} className={cn("overflow-hidden rounded-fx-lg border border-l-4 border-fx-line bg-fx-paper", status.border)}>
      <Link
        to="/$orgSlug/profile"
        params={{ orgSlug }}
        search={{ section: open ? undefined : section.key }}
        replace
        resetScroll={false}
        aria-expanded={open}
        className="flex items-start gap-4 p-5 transition hover:bg-fx-panel sm:px-6"
      >
        <StatusIcon section={section} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-fx-heading text-fx-ink">{title}</span>
            <Badge tone={status.badge}>{status.label}</Badge>
          </span>
          <span className="mt-1 block text-fx-body text-fx-ink2">{section.description}</span>
        </span>
        <ChevronDown aria-hidden className={cn("mt-2 size-5 shrink-0 text-fx-muted transition-transform", open && "rotate-180")} />
      </Link>
      {open && (
        <div className="border-t border-fx-line bg-fx-panel px-5 py-8 sm:px-6">
          <p className="text-fx-body text-fx-muted">This section’s form comes next.</p>
        </div>
      )}
    </div>
  );
}
