import type { ReactNode } from "react";

export function Section({ n, title, lede, children }: { n: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section className="mt-20 first:mt-0">
      <div className="flex items-baseline gap-4">
        <span className="font-fx-display text-fx-label text-fx-muted uppercase">{n}</span>
        <h2 className="text-fx-title text-fx-ink">{title}</h2>
      </div>
      {lede && <p className="mt-3 max-w-2xl text-fx-lead text-fx-ink2">{lede}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** One component in the catalog: its name, the import path, then live examples. */
export function Row({ label, source, hint, children }: { label: string; source: string; hint?: string; children: ReactNode }) {
  return (
    <div className="border-t border-fx-line py-7 first:border-t-0">
      <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-fx-heading text-fx-ink">{label}</h3>
        <code className="rounded-fx-sm bg-fx-panel px-2 py-0.5 font-mono text-[11.5px] text-fx-ink2">{source}</code>
        {hint && <p className="w-full text-fx-small text-fx-muted">{hint}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
