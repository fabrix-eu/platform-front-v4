import { Link } from "@tanstack/react-router";
import { ButtonLink } from "@/components/ui/Button";
import { SurfaceSwitcher } from "./SurfaceSwitcher";

// The public sections of the platform: what a visitor can open without an account.
const NAV = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/events", label: "Events" },
  { to: "/manual", label: "User Manual" },
] as const;

const LINK = "text-fx-nav font-medium whitespace-nowrap text-fx-ink2 transition hover:text-fx-ink";
// Important: activeProps appends to className, where font-medium would otherwise win.
const ACTIVE = { className: "!font-extrabold !text-fx-ink" };

// The top bar a visitor sees (landing, marketplace, manual, events): the mark, the surface
// switcher, the public sections and the two ways in. Mark, switcher, bar height and link
// size match the website and the Learning Hub, so moving between the three keeps the bar.
export function PublicHeader() {
  return (
    <header className="border-b border-fx-line bg-fx-paper">
      <div className="mx-auto flex h-topbar max-w-6xl items-center gap-4 px-4 sm:px-8 lg:px-12">
        <div className="flex flex-none items-center gap-2.5">
          <Link to="/" aria-label="FABRIX home">
            <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
          </Link>
          <span aria-hidden className="h-5 w-px bg-fx-line2" />
          <SurfaceSwitcher />
        </div>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className={LINK} activeProps={ACTIVE}>
              {item.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Account" className="ml-auto flex items-center gap-2">
          <ButtonLink to="/login" variant="ghost" size="sm" className="max-sm:hidden">
            Sign in
          </ButtonLink>
          <ButtonLink to="/register" size="sm">
            Get started
          </ButtonLink>
        </nav>
      </div>

      {/* Three sections do not warrant a burger: on narrow screens they get their own row. */}
      <nav aria-label="Main" className="flex h-11 items-center gap-5 overflow-x-auto border-t border-fx-line px-4 sm:px-8 md:hidden">
        {NAV.map((item) => (
          <Link key={item.to} to={item.to} className={LINK} activeProps={ACTIVE}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
