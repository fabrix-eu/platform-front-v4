import { Link } from "@tanstack/react-router";
import { useCurrentOrg } from "@/lib/activeOrg";
import { NavSections } from "./NavSections";
import { OrgSwitcher } from "./OrgSwitcher";
import { SurfaceSwitcher } from "./SurfaceSwitcher";
import { UserMenu } from "./UserMenu";
import { useUnreadCounts } from "./useUnreadCounts";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { me, currentOrg } = useCurrentOrg();
  const counts = useUnreadCounts();

  return (
    <div
      className="flex h-full w-full flex-col"
      // In the mobile drawer, following any link closes it.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a[href]")) onNavigate?.();
      }}
    >
      {/* The mark and the surface switcher, as on the public bar, the website and the Learning Hub. */}
      <div className="flex items-center gap-2.5 px-6 pt-6 pb-5">
        <Link to="/" aria-label="FABRIX home" className="flex-none">
          <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
        </Link>
        <span aria-hidden className="h-5 w-px flex-none bg-fx-line2" />
        <SurfaceSwitcher />
      </div>
      <div className="px-3">
        <OrgSwitcher />
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pb-6">
        <NavSections me={me} currentOrg={currentOrg} counts={counts} />
      </nav>
      <div className="border-t border-fx-line p-3">
        <UserMenu />
      </div>
    </div>
  );
}
