import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuContentClass, menuItemClass } from "@/components/ui/menu";

// The three FABRIX surfaces. Same entries, labels and order on the website and the
// Learning Hub (each has its own SurfaceSwitcher) — keep them in step.
const SURFACES = [
  { label: "Project", href: "https://fabrixproject.eu", blurb: "The project and its cities" },
  { label: "Platform", href: null, blurb: "Map, marketplace, Compass" },
  { label: "Learning Hub", href: "https://learn.fabrixproject.eu", blurb: "Guides and case studies" },
] as const;

const ITEM = cn(menuItemClass, "flex-col items-start gap-0");

// The name of this surface next to the wordmark, read as part of the logo. It opens the
// other two surfaces; each entry goes to that surface's home.
export function SurfaceSwitcher() {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="flex items-center gap-1 text-fx-surface font-medium whitespace-nowrap text-fx-ink2 outline-none transition hover:text-fx-ink data-[state=open]:text-fx-ink">
        Platform
        <ChevronDown aria-hidden className="size-4 text-fx-muted" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" sideOffset={16} className={cn(menuContentClass, "w-64")}>
          {SURFACES.map((surface) => {
            const content = (
              <>
                <span className="flex items-center gap-1.5 font-bold">
                  {surface.label}
                  {surface.href && <ArrowUpRight aria-hidden className="size-3.5 text-fx-muted" />}
                </span>
                <span className="text-fx-small text-fx-muted">{surface.blurb}</span>
              </>
            );
            return (
              <DropdownMenu.Item key={surface.label} asChild>
                {surface.href ? (
                  <a href={surface.href} className={ITEM}>
                    {content}
                  </a>
                ) : (
                  <Link to="/" aria-current="page" className={cn(ITEM, "bg-fx-violet-soft data-[highlighted]:bg-fx-violet-soft")}>
                    {content}
                  </Link>
                )}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
