import type { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";

// The frame of the pages a visitor can see without an account (the marketplace):
// the same content column as AppShell, and a way in at the top.
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-fx-panel">
      <PublicHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
    </div>
  );
}
