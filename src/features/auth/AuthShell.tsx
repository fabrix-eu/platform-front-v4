import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

interface AuthShellProps {
  title: string;
  lede?: string;
  children: ReactNode;
  footer?: ReactNode;
}

// The frame of every logged-out auth page: logo above the card, a secondary line under it.
export function AuthShell({ title, lede, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-fx-panel px-4 py-12">
      <Link to="/login" aria-label="FABRIX">
        <img src="/fabrix-logo.svg" alt="FABRIX" className="h-9" />
      </Link>
      <div className="mt-8 w-full max-w-sm rounded-fx-lg border border-fx-line bg-fx-paper p-8">
        <h1 className="text-fx-title text-fx-ink">{title}</h1>
        {lede && <p className="mt-2 text-fx-body text-fx-ink2">{lede}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-6 text-fx-body text-fx-ink2">{footer}</div>}
    </div>
  );
}

export const linkClass = "font-bold text-fx-emphasis hover:underline";

export const submitClass =
  "w-full rounded-fx-action bg-fx-emphasis px-5 py-2.5 text-fx-body font-bold text-fx-emphasis-ink " +
  "hover:brightness-110 disabled:opacity-60";
