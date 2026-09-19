import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { FeedbackButton } from "@/features/feedback/FeedbackButton";
import { UNREAD_KEY } from "./useUnreadCounts";

// The frame of every signed-in page: a fixed sidebar on desktop, a drawer on mobile.
export function AppShell({ children }: { children: ReactNode }) {
  // Ephemeral: whether the mobile drawer is open.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const queryClient = useQueryClient();

  // Counts change as you act (read a message, answer a request): refresh them on each page.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: UNREAD_KEY });
  }, [pathname, queryClient]);

  return (
    <div className="min-h-screen bg-fx-panel">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-fx-line bg-fx-paper lg:flex">
        <Sidebar />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-fx-line bg-fx-paper px-4 py-3 lg:hidden">
        <Link to="/" aria-label="FABRIX home">
          <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
        </Link>
        <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
          <Dialog.Trigger asChild>
            <button type="button" aria-label="Open menu" className="rounded-fx-action p-2 text-fx-ink2 hover:bg-fx-panel">
              <Menu className="size-5" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-fx-ink/30" />
            <Dialog.Content aria-describedby={undefined} className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] bg-fx-paper shadow-xl">
              <Dialog.Title className="sr-only">Navigation</Dialog.Title>
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
              <Dialog.Close aria-label="Close menu" className="absolute top-5 right-3 rounded-fx-action p-2 text-fx-muted hover:bg-fx-panel">
                <X className="size-5" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</div>
      </main>

      <FeedbackButton />
    </div>
  );
}
