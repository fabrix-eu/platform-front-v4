const SWATCHES: { group: string; names: string[] }[] = [
  { group: "Ground & ink", names: ["ground", "panel", "paper", "ink", "ink2", "muted", "line", "line2"] },
  { group: "Emphasis", names: ["emphasis", "emphasis-ink", "emphasis-soft", "violet", "violet-soft", "violet-border"] },
  { group: "Accents", names: ["teal", "green", "amber", "rose", "indigo", "orange", "on-accent"] },
  { group: "Soft fills", names: ["teal-soft", "green-soft", "amber-soft", "rose-soft", "indigo-soft", "slate-soft"] },
];

// Reads the resolved value, so the page prints what it is actually rendering.
function resolved(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

export function Swatches() {
  return (
    <div className="grid gap-12">
      {SWATCHES.map((g) => (
        <div key={g.group}>
          <h3 className="mb-4 text-fx-heading text-fx-ink">{g.group}</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {g.names.map((name) => {
              const token = `--color-fx-${name}`;
              return (
                <div key={name}>
                  <div className="h-20 rounded-fx border border-fx-line" style={{ backgroundColor: `var(${token})` }} />
                  <p className="mt-2 text-fx-small font-bold text-fx-ink">{name}</p>
                  <p className="font-mono text-[11px] text-fx-muted">{resolved(token)}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const DISPLAY = [
  { cls: "text-fx-hero", name: "hero · 52/800", sample: "Circular textile, connected" },
  { cls: "text-fx-display", name: "display · 36/800", sample: "Find what you need nearby" },
  { cls: "text-fx-title", name: "title · 26/800", sample: "Maasstad Textiles" },
  { cls: "text-fx-heading", name: "heading · 18/700", sample: "Woven cotton roll-ends" },
];

export function TypeScale() {
  return (
    <div className="rounded-fx-lg border border-fx-line bg-fx-paper p-8">
      {DISPLAY.map((t) => (
        <div key={t.name} className="border-t border-fx-line py-6 first:border-t-0 first:pt-0">
          <span className="mb-3 block text-fx-small font-bold text-fx-muted">{t.name}</span>
          <p className={`font-fx-display ${t.cls} text-fx-ink`}>{t.sample}</p>
        </div>
      ))}
      <div className="border-t border-fx-line pt-6">
        <span className="mb-3 block text-fx-small font-bold text-fx-muted">lead 16 · body 14 · small 12.5 · label 11</span>
        <p className="max-w-2xl text-fx-lead text-fx-ink2">Lead. Once at the top of a page, to say what it is for.</p>
        <p className="mt-3 max-w-2xl text-fx-body text-fx-ink2">Body. The default — descriptions, form help, card copy.</p>
        <p className="mt-3 text-fx-small text-fx-muted">Small. Metadata, counts, timestamps.</p>
        <p className="mt-3 font-fx-display text-fx-label text-fx-muted uppercase">Label — uppercase, tracked out</p>
      </div>
    </div>
  );
}

const RADII = [
  { name: "fx-sm · 9", cls: "rounded-fx-sm" },
  { name: "fx · 14", cls: "rounded-fx" },
  { name: "fx-lg · 20", cls: "rounded-fx-lg" },
  { name: "fx-xl · 28", cls: "rounded-fx-xl" },
  { name: "fx-action · 11", cls: "rounded-fx-action" },
];

export function Radii() {
  return (
    <div className="flex flex-wrap gap-6">
      {RADII.map((r) => (
        <div key={r.name}>
          <div className={`size-28 border-2 border-fx-emphasis bg-fx-paper ${r.cls}`} />
          <p className="mt-2 text-fx-small font-bold text-fx-ink">{r.name}</p>
        </div>
      ))}
    </div>
  );
}
