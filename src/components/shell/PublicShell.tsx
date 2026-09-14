import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ButtonLink } from "@/components/ui/Button";

// The frame of the pages a visitor can see without an account (the marketplace):
// the same content column as AppShell, and a way in at the top.
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-fx-panel">
      <header className="border-b border-fx-line bg-fx-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12">
          <Link to="/marketplace" aria-label="FABRIX marketplace">
            <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
          </Link>
          <nav aria-label="Account" className="flex items-center gap-2">
            <ButtonLink to="/login" variant="ghost" size="sm">
              Sign in
            </ButtonLink>
            <ButtonLink to="/register" size="sm">
              Join FABRIX
            </ButtonLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
    </div>
  );
}
