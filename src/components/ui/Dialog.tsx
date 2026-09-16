import type { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

interface DialogContentProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A centred modal (Radix Dialog): focus trap, Escape and overlay click close it. */
export function DialogContent({ title, description, children, className }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 z-50 bg-fx-ink/40" />
      <RadixDialog.Content
        {...(description ? {} : { "aria-describedby": undefined })}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col",
          "rounded-fx-lg bg-fx-paper shadow-xl shadow-fx-ink/10",
          className,
        )}
      >
        {/* The title stays put: only the content scrolls. */}
        <div className="shrink-0 px-6 pt-6 sm:px-8 sm:pt-8">
          <div className="flex items-start justify-between gap-4">
            <RadixDialog.Title className="text-fx-title text-fx-ink">{title}</RadixDialog.Title>
            <RadixDialog.Close aria-label="Close" className="-mt-1 -mr-2 rounded-fx-action p-2 text-fx-muted hover:bg-fx-panel hover:text-fx-ink">
              <X className="size-5" />
            </RadixDialog.Close>
          </div>
          {description && <RadixDialog.Description className="mt-2 text-fx-body text-fx-ink2">{description}</RadixDialog.Description>}
        </div>
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">{children}</div>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}
