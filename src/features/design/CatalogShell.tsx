import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, Pencil, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { menuContentClass, menuDangerItemClass, menuItemClass, menuLabelClass, menuSeparatorClass } from "@/components/ui/menu";
import { PageHeader } from "@/components/ui/PageHeader";
import { Row } from "./Section";

// The pieces that frame a page: its header, and the menus of the shell.
export function CatalogShell() {
  return (
    <>
      <Row label="PageHeader" source="components/ui/PageHeader" hint="every page starts with one · eyebrow = the organisation the page is about · the main action top right">
        <div className="w-full rounded-fx border border-fx-line bg-fx-panel p-6">
          <PageHeader
            eyebrow="Maasstad Textiles"
            title="Listings"
            lede="What your organisation offers and looks for."
            actions={
              <Button>
                <Plus className="size-4" strokeWidth={2.6} />
                Add a listing
              </Button>
            }
          />
        </div>
      </Row>

      <Row label="Menu" source="components/ui/menu" hint="Radix DropdownMenu styled by these classes — the org switcher and the user menu use them">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary">
              Actions
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="start" sideOffset={6} className={menuContentClass}>
              <DropdownMenu.Label className={menuLabelClass}>Woven cotton roll-ends</DropdownMenu.Label>
              <DropdownMenu.Item className={menuItemClass}>
                <Pencil className="size-4 text-fx-muted" />
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item className={menuItemClass}>
                <Share2 className="size-4 text-fx-muted" />
                Share with a partner
              </DropdownMenu.Item>
              <DropdownMenu.Separator className={menuSeparatorClass} />
              <DropdownMenu.Item className={menuDangerItemClass}>
                <LogOut className="size-4" />
                Archive
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </Row>
    </>
  );
}
