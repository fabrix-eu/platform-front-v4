export function StepProgress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="mb-7">
      <p className="text-fx-small font-bold text-fx-muted">
        Step {step} of {total} · <span className="text-fx-ink2">{label}</span>
      </p>
      <div className="mt-2 h-1 rounded-full bg-fx-line" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step}>
        <div className="h-1 rounded-full bg-fx-emphasis transition-[width]" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}
