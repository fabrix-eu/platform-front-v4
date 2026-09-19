import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackForm } from "./FeedbackForm";

/**
 * Quiet by design: a single small button pinned out of the way, opening a panel rather than
 * a modal — reporting a problem should not hide the screen the problem is on.
 *
 * Top right on desktop, as asked. On phones that corner already holds the menu button, so it
 * moves to the opposite corner instead of fighting for the same few pixels.
 */
export function FeedbackButton() {
  // Ephemeral: whether the panel is open.
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Send feedback"
          className="fixed right-4 bottom-4 z-30 flex items-center gap-2 rounded-fx-action border border-fx-line bg-fx-paper px-3 py-2 text-fx-small text-fx-ink2 shadow-sm transition hover:border-fx-emphasis hover:text-fx-ink lg:top-4 lg:bottom-auto"
        >
          <MessageSquarePlus className="size-4" />
          <span className="hidden sm:inline">Feedback</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-[min(24rem,calc(100vw-2rem))] rounded-fx-lg border border-fx-line bg-fx-paper p-5 shadow-xl shadow-fx-ink/10"
        >
          <h2 className="text-fx-heading text-fx-ink">Tell us what you see</h2>
          <p className="mt-1 mb-4 text-fx-small text-fx-ink2">
            Rough notes are welcome — we would rather hear it early than politely.
          </p>
          {open && <FeedbackForm onSent={() => setOpen(false)} />}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
