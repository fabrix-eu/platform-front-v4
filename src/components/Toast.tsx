import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toastBus, type ToastVariant } from "@/lib/toastBus";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// App-wide toast access. Mounted once at the router root (see __root.tsx).
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const VARIANT_STYLE: Record<ToastVariant, string> = {
  success: "border-fx-line bg-fx-paper text-fx-ink",
  error: "border-fx-rose bg-fx-rose-soft text-fx-ink",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    setItems((prev) => [...prev, { id: nextId.current++, message, variant }]);
  }, []);

  // Toasts raised outside React (global mutation error handler, see lib/queryClient.ts).
  useEffect(() => toastBus.subscribe(toast), [toast]);

  const remove = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToast.Provider swipeDirection="right" duration={4000}>
        {children}
        {items.map((item) => (
          <RadixToast.Root
            key={item.id}
            onOpenChange={(open) => !open && remove(item.id)}
            className={cn(
              "flex items-center gap-3 rounded-fx border px-4 py-3 text-fx-body shadow-lg",
              "transition-all data-[state=closed]:opacity-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0",
              VARIANT_STYLE[item.variant],
            )}
          >
            <RadixToast.Title className="flex-1 font-bold">{item.message}</RadixToast.Title>
            <RadixToast.Close aria-label="Close" className="text-fx-muted outline-none hover:text-fx-ink">
              <X className="size-4" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed right-0 bottom-0 z-[100] flex w-80 max-w-[100vw] flex-col gap-2 p-4 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
