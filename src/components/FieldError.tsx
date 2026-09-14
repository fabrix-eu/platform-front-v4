import { ApiError } from "@/lib/api";

// Shared form components only need these two fields, so any concrete useMutation result fits.
export interface AnyMutation {
  error: Error | null;
  isPending: boolean;
}

export function FieldError({ mutation, field }: { mutation: AnyMutation; field: string }) {
  const error = mutation.error;
  if (!(error instanceof ApiError)) return null;
  const message = error.errors[field]?.[0];
  return message ? <p className="mt-1.5 text-fx-small text-fx-rose">{message}</p> : null;
}

const BANNER = "mb-4 rounded-fx-sm bg-fx-rose-soft px-4 py-3 text-fx-body text-fx-ink";

// Global / base-level error (validation key `base`, or a non-API failure).
export function FormError({ mutation }: { mutation: AnyMutation }) {
  const error = mutation.error;
  if (!error) return null;

  if (error instanceof ApiError) {
    const base = error.errors.base?.[0];
    if (base) return <div role="alert" className={BANNER}>{base}</div>;
    // Business error with no per-field errors (e.g. invalid credentials) — show its message.
    if (Object.keys(error.errors).length === 0) {
      return <div role="alert" className={BANNER}>{error.message}</div>;
    }
    return null; // field errors are rendered next to each field
  }

  return <div role="alert" className={BANNER}>Something went wrong. Please try again.</div>;
}
