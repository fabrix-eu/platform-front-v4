import { Link } from "@tanstack/react-router";
import { ButtonLink } from "@/components/ui/Button";

// The top bar a visitor sees (landing, marketplace): the mark, and the two ways in.
export function PublicHeader() {
  return (
    <header className="border-b border-fx-line bg-fx-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-12">
        <Link to="/" aria-label="FABRIX home">
          <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
        </Link>
        <nav aria-label="Account" className="flex items-center gap-2">
          <ButtonLink to="/login" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink to="/register" size="sm">
            Get started
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
