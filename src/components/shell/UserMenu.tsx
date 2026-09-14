import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { logout, meQueryOptions } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { menuContentClass, menuDangerItemClass, menuItemClass, menuSeparatorClass } from "@/components/ui/menu";

export function UserMenu() {
  const { data: me } = useSuspenseQuery(meQueryOptions);
  const navigate = useNavigate();

  async function signOut() {
    await logout();
    navigate({ to: "/login" });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="flex w-full items-center gap-3 rounded-fx px-2.5 py-2 text-left outline-none hover:bg-fx-panel focus-visible:ring-3 focus-visible:ring-fx-emphasis-soft"
        >
          <Avatar name={me.name} src={me.image_url} kind="person" size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-fx-body font-bold text-fx-ink">{me.name}</span>
            <span className="block truncate text-fx-small text-fx-muted">{me.email}</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-fx-muted" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content side="top" align="start" sideOffset={6} className={`${menuContentClass} w-[var(--radix-dropdown-menu-trigger-width)]`}>
          <DropdownMenu.Item className={menuItemClass} onSelect={() => navigate({ to: "/settings" })}>
            <Settings className="size-4 text-fx-muted" />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator className={menuSeparatorClass} />
          <DropdownMenu.Item className={menuDangerItemClass} onSelect={signOut}>
            <LogOut className="size-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
