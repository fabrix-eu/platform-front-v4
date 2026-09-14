import { ApiError } from "@/lib/api";
import { Banner } from "@/components/ui/Banner";

// Shared form components only need these two fields, so any concrete useMutation result fits.
export interface AnyMutation {
  error: Error | null;
  isPending: boolean;
}

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

// Global / base-level error (validation key `base`, or a non-API failure).
export function FormError({ mutation }: { mutation: AnyMutation }) {
  const error = mutation.error;
  if (!error) return null;

  let message = "Something went wrong. Please try again.";
  if (error instanceof ApiError) {
    const base = error.errors.base?.[0];
    // A business error with no per-field errors (e.g. invalid credentials) shows its own message;
    // field errors are rendered next to each field.
    if (base) message = base;
    else if (Object.keys(error.errors).length === 0) message = error.message;
    else return null;
  }

  return (
    <Banner tone="danger" className="mb-4">
      {message}
    </Banner>
  );
}
