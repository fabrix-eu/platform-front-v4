import type { ReactNode } from "react";
import {
  Bell,
  Building2,
  Calendar,
  Compass,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutDashboard,
  Map,
  MessageSquare,
  Network,
  Settings,
  ShoppingBag,
  Tag,
  Users,
} from "lucide-react";
import { isFacilitator, type MeOrganization, type User } from "@/lib/auth";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExternalNavLink, NavLink } from "@/components/ui/NavLink";
import type { UnreadCounts } from "./useUnreadCounts";

function Group({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="mt-6 space-y-0.5 first:mt-3">
      {label && <Eyebrow className="mb-2 truncate px-3">{label}</Eyebrow>}
      {children}
    </div>
  );
}

interface NavSectionsProps {
  me: User;
  currentOrg: MeOrganization | undefined;
  counts: UnreadCounts;
}

// Flat, single level: the whole network first, then the facilitator's CRM, then
// the current organisation, then personal.
export function NavSections({ me, currentOrg, counts }: NavSectionsProps) {
  const orgSlug = currentOrg?.organization_slug;

  return (
    <>
      <Group>
        {orgSlug ? (
          <NavLink to="/$orgSlug/dashboard" params={{ orgSlug }} icon={Home}>
            Home
          </NavLink>
        ) : (
          <NavLink to="/home" icon={Home}>
            Home
          </NavLink>
        )}
        <NavLink to="/marketplace" icon={ShoppingBag}>Marketplace</NavLink>
        <NavLink to="/events" icon={Calendar}>Events</NavLink>
        <NavLink to="/global" icon={Map}>Directory</NavLink>
      </Group>

      {isFacilitator(me) && (
        <Group label="Facilitator">
          <NavLink to="/facilitator" activeOptions={{ exact: true }} icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink to="/facilitator/network" icon={FolderKanban}>My network</NavLink>
        </Group>
      )}

      {orgSlug ? (
        <Group label={currentOrg.organization_name}>
          <NavLink to="/$orgSlug/profile" params={{ orgSlug }} icon={Building2}>Profile</NavLink>
          <NavLink to="/$orgSlug/listings" params={{ orgSlug }} icon={Tag}>Listings</NavLink>
          <NavLink to="/$orgSlug/assessments" params={{ orgSlug }} icon={Compass}>Compass</NavLink>
          <NavLink to="/$orgSlug/relations" params={{ orgSlug }} icon={Network}>Connections</NavLink>
          {/* Members carries "invite a partner" — the primary referral loop. */}
          <NavLink to="/$orgSlug/settings/members" params={{ orgSlug }} icon={Users}>Members</NavLink>
          <NavLink to="/$orgSlug/messages" params={{ orgSlug }} icon={MessageSquare} count={counts.messages} alert>
            Messages
          </NavLink>
        </Group>
      ) : (
        <Group>
          <NavLink to="/messages" icon={MessageSquare} count={counts.messages} alert>Messages</NavLink>
        </Group>
      )}

      <Group label="Resources">
        <ExternalNavLink href="https://learn.fabrixproject.eu" icon={GraduationCap}>Learning Hub</ExternalNavLink>
      </Group>

      <Group>
        <NavLink to="/notifications" icon={Bell} count={counts.notifications} alert>Notifications</NavLink>
        <NavLink to="/settings" icon={Settings}>Settings</NavLink>
      </Group>
    </>
  );
}
