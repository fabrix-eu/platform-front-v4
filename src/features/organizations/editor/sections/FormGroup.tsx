import type { ReactNode } from "react";

interface FormGroupProps {
  title: string;
  description?: ReactNode;
  /** Right of the title — e.g. who can see these fields. */
  aside?: ReactNode;
  children: ReactNode;
}

/** A titled group of fields inside an editor section ("Who you are", "Where you are"…). */
export function FormGroup({ title, description, aside, children }: FormGroupProps) {
  return (
    <fieldset className="space-y-5 border-t border-fx-line pt-6 first:border-t-0 first:pt-0">
      <legend className="float-left mb-3 flex w-full flex-wrap items-center justify-between gap-3 text-fx-heading text-fx-ink">
        {title}
        {aside}
      </legend>
      {description && <p className="clear-both -mt-4 text-fx-small text-fx-muted">{description}</p>}
      <div className="clear-both space-y-5">{children}</div>
    </fieldset>
  );
}
