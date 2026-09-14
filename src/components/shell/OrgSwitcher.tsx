import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useCurrentOrg } from "@/lib/activeOrg";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { menuContentClass, menuItemClass, menuLabelClass, menuSeparatorClass } from "@/components/ui/menu";
import { orgKindLabel } from "@/features/organizations/kinds";

export function OrgSwitcher() {
  const { me, orgSlug, currentOrg } = useCurrentOrg();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  // No organisation yet: the most valuable thing this spot can ask for.
  if (!currentOrg) {
    return (
      <ButtonLink to="/organizations/new" variant="outline" size="sm" className="w-full">
        <Plus className="size-4" strokeWidth={2.6} />
        Add your organisation
      </ButtonLink>
    );
  }

  // Inside an org page, switching keeps the section (Members → the other org's Members).
  const switchTo = (slug: string) => {
    if (orgSlug) navigate({ href: pathname.replace(`/${orgSlug}`, `/${slug}`) });
    else navigate({ to: "/$orgSlug/dashboard", params: { orgSlug: slug } });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Switch organisation"
          className="flex w-full items-center gap-3 rounded-fx border border-fx-line px-2.5 py-2 text-left outline-none hover:border-fx-line2 hover:bg-fx-panel focus-visible:ring-3 focus-visible:ring-fx-emphasis-soft"
        >
          <Avatar name={currentOrg.organization_name} src={currentOrg.organization_image_url} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-fx-body font-bold text-fx-ink">{currentOrg.organization_name}</span>
            <span className="block truncate text-fx-small text-fx-muted">{orgKindLabel(currentOrg.organization_kind)}</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-fx-muted" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" sideOffset={6} className={`${menuContentClass} w-[var(--radix-dropdown-menu-trigger-width)]`}>
          <DropdownMenu.Label className={menuLabelClass}>Your organisations</DropdownMenu.Label>
          <div className="max-h-72 overflow-y-auto">
            {me.organizations.map((org) => (
              <DropdownMenu.Item key={org.organization_id} className={menuItemClass} onSelect={() => switchTo(org.organization_slug)}>
                <Avatar name={org.organization_name} src={org.organization_image_url} size="sm" />
                <span className="min-w-0 flex-1 truncate">{org.organization_name}</span>
                {org.organization_slug === currentOrg.organization_slug && <Check className="size-4 shrink-0 text-fx-emphasis" />}
              </DropdownMenu.Item>
            ))}
          </div>
          <DropdownMenu.Separator className={menuSeparatorClass} />
          <DropdownMenu.Item className={menuItemClass} onSelect={() => navigate({ to: "/organizations/new" })}>
            <Plus className="size-4 text-fx-muted" />
            Add an organisation
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
