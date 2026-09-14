// Lets non-React code (the QueryClient's global mutation error handler) raise a
// toast. <ToastProvider> subscribes on mount; messages emitted before that are dropped.
export type ToastVariant = "success" | "error";
type Listener = (message: string, variant: ToastVariant) => void;

const listeners = new Set<Listener>();

export const toastBus = {
  subscribe(fn: Listener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(message: string, variant: ToastVariant = "success"): void {
    listeners.forEach((fn) => fn(message, variant));
  },
};
