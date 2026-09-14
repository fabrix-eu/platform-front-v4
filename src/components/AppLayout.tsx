import type { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { logout, meQueryOptions } from "@/lib/auth";

// Placeholder shell for the scaffold. The real sidebar (flat nav from /design)
// replaces it in the "Shell & auth" step.
export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { data: me } = useQuery(meQueryOptions);

  const signOut = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-fx-ground">
      <header className="flex items-center justify-between border-b border-fx-line px-6 py-4">
        <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
        <div className="flex items-center gap-4">
          <span className="text-fx-small font-bold text-fx-ink2">{me?.name}</span>
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="rounded-fx-action p-2 text-fx-muted hover:bg-fx-panel hover:text-fx-ink"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>
      <main className="min-h-[calc(100vh-65px)] bg-fx-panel px-6 py-10 sm:px-12">{children}</main>
    </div>
  );
}
