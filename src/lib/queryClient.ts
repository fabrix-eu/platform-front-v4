import { MutationCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";
import { toastBus } from "./toastBus";

declare module "@tanstack/react-query" {
  interface Register {
    // Set `meta: { silentErrors: true }` on a mutation that renders its own errors.
    mutationMeta: { silentErrors?: boolean };
  }
}

// Input errors (422 validation, 401 credentials) are rendered inline by the
// forms (FieldError / FormError). Everything else would fail silently, so it
// surfaces as an error toast unless the mutation opts out.
function isInlineError(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 422 || error.status === 401);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.silentErrors || isInlineError(error)) return;
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      toastBus.emit(message, "error");
    },
  }),
});
