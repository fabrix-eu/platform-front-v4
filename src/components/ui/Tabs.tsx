import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { createLink, type LinkComponent } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

/** A row of tabs. Tabs are links: the active tab is a URL (path or search param), never local state. */
export function TabList({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    // overflow-y-hidden: the active tab's border sits 1px over the list's, which would
    // otherwise make the row scroll vertically and show a scrollbar.
    <nav aria-label={label} className={cn("flex gap-8 overflow-x-auto overflow-y-hidden border-b border-fx-line", className)}>
      {children}
    </nav>
  );
}

type TabAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Overrides the router's active detection (e.g. when only one search param differs). */
  active?: boolean;
  "data-status"?: string;
};

const TabAnchor = forwardRef<HTMLAnchorElement, TabAnchorProps>(({ active, className, ...rest }, ref) => {
  const status = active === undefined ? rest["data-status"] : active ? "active" : undefined;
  return (
    <a
      ref={ref}
      {...rest}
      data-status={status}
      aria-current={status === "active" ? "page" : undefined}
      className={cn(
        "-mb-px shrink-0 border-b-[3px] border-transparent pb-3 font-fx-display text-[15px] font-bold text-fx-muted",
        "transition hover:text-fx-ink",
        "data-[status=active]:border-fx-emphasis data-[status=active]:font-extrabold data-[status=active]:text-fx-ink",
        className,
      )}
    />
  );
});
TabAnchor.displayName = "TabAnchor";

const CreatedTabLink = createLink(TabAnchor);

export const TabLink: LinkComponent<typeof TabAnchor> = (props) => <CreatedTabLink preload="intent" {...props} />;
