import { ApiError } from "@/lib/api";
import { Banner } from "@/components/ui/Banner";

// Shared form components only need these two fields, so any concrete useMutation result fits.
export interface AnyMutation {
  error: Error | null;
  isPending: boolean;
}

/** For fields rendered before any mutation exists (a wizard step whose data is sent later). */
export const IDLE_MUTATION: AnyMutation = { error: null, isPending: false };

/** The first server error for a field, if any. */
export function fieldError(mutation: AnyMutation, field: string): string | undefined {
  return mutation.error instanceof ApiError ? mutation.error.errors[field]?.[0] : undefined;
}

export function FieldError({ mutation, field, id }: { mutation: AnyMutation; field: string; id?: string }) {
  const message = fieldError(mutation, field);
  return message ? (
    <p id={id} className="mt-1.5 text-fx-small text-fx-rose">
      {message}
    </p>
  ) : null;
}

const humanize = (key: string) => key.replace(/_id$/, "").replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/**
 * Global error: `base`, a business error without field errors (e.g. invalid credentials),
 * a non-API failure — and, when `fields` lists the fields the form renders, any error on a
 * field it does not render (so none is swallowed).
 */
export function FormError({ mutation, fields }: { mutation: AnyMutation; fields?: string[] }) {
  const error = mutation.error;
  if (!error) return null;

  let message = "Something went wrong. Please try again.";
  if (error instanceof ApiError) {
    const unrendered = fields ? Object.entries(error.errors).find(([key]) => key !== "base" && !fields.includes(key)) : undefined;
    const base = error.errors.base?.[0];
    if (base) message = base;
    else if (unrendered) message = `${humanize(unrendered[0])} ${unrendered[1][0]}`;
    else if (Object.keys(error.errors).length === 0) message = error.message;
    else return null;
  }

  return (
    <Banner tone="danger" className="mb-4">
      {message}
    </Banner>
  );
}
