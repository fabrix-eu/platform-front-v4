import type { ReactNode } from "react";

/** A titled group of fields inside an editor section ("Who you are", "Where you are"…). */
export function FormGroup({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <fieldset className="space-y-5 border-t border-fx-line pt-6 first:border-t-0 first:pt-0">
      <legend className="float-left mb-3 w-full text-fx-heading text-fx-ink">{title}</legend>
      {description && <p className="clear-both -mt-4 text-fx-small text-fx-muted">{description}</p>}
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  );
}
