import { Link } from "@tanstack/react-router";
import { useCurrentOrg } from "@/lib/activeOrg";
import { NavSections } from "./NavSections";
import { OrgSwitcher } from "./OrgSwitcher";
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
      <div className="px-6 pt-6 pb-5">
        <Link to="/" aria-label="FABRIX home">
          <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
        </Link>
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
