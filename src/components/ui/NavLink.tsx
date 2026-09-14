import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// The active entry is filled, not tinted.
const ITEM = cn(
  "group flex items-center gap-3 rounded-fx px-3 py-2 font-fx-text text-fx-body font-medium text-fx-ink2 transition",
  "[&:not([data-status=active])]:hover:bg-fx-panel [&:not([data-status=active])]:hover:text-fx-ink",
  "data-[status=active]:bg-fx-emphasis data-[status=active]:font-bold data-[status=active]:text-fx-emphasis-ink",
);

function Content({ icon: Icon, count, alert, trailing, children }: { icon: LucideIcon; count?: number; alert?: boolean; trailing?: ReactNode; children: ReactNode }) {
  return (
    <>
      <Icon aria-hidden className="size-[19px] shrink-0 text-fx-muted group-data-[status=active]:text-fx-emphasis-ink" strokeWidth={2} />
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {count ? (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-fx-small font-bold",
            alert
              ? "bg-fx-orange text-fx-on-accent"
              : "bg-fx-slate-soft text-fx-ink2 group-data-[status=active]:bg-fx-emphasis-ink/25 group-data-[status=active]:text-fx-emphasis-ink",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
      {trailing}
    </>
  );
}

type NavAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon: LucideIcon;
  /** A number next to the label; `alert` turns it orange (something needs you). */
  count?: number;
  alert?: boolean;
  /** Overrides the router's active detection. */
  active?: boolean;
  "data-status"?: string;
};

const NavAnchor = forwardRef<HTMLAnchorElement, NavAnchorProps>(
  ({ icon, count, alert, active, className, children, ...rest }, ref) => {
    const status = active === undefined ? rest["data-status"] : active ? "active" : undefined;
    return (
      <a ref={ref} {...rest} data-status={status} aria-current={status === "active" ? "page" : undefined} className={cn(ITEM, className)}>
        <Content icon={icon} count={count} alert={alert}>
          {children}
        </Content>
      </a>
    );
  },
);
NavAnchor.displayName = "NavAnchor";

const CreatedNavLink = createLink(NavAnchor);

export const NavLink: LinkComponent<typeof NavAnchor> = (props) => <CreatedNavLink preload="intent" {...props} />;

type ExternalNavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> & { href: string; icon: LucideIcon };

/** Same look, for another site (Learning Hub): opens in a new tab and says so. */
export function ExternalNavLink({ icon, className, children, ...rest }: ExternalNavLinkProps) {
  return (
    <a target="_blank" rel="noopener noreferrer" className={cn(ITEM, className)} {...rest}>
      <Content icon={icon} trailing={<ArrowUpRight aria-label="opens in a new tab" className="size-4 shrink-0 text-fx-muted" />}>
        {children}
      </Content>
    </a>
  );
}
