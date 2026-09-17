import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut, Pencil, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { menuContentClass, menuDangerItemClass, menuItemClass, menuLabelClass, menuSeparatorClass } from "@/components/ui/menu";
import { PageHeader } from "@/components/ui/PageHeader";
import { PublicHeader } from "@/components/shell/PublicHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { SurfaceSwitcher } from "@/components/shell/SurfaceSwitcher";
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

      <Row label="Dialog" source="components/ui/Dialog" hint="Radix Dialog — focus trapped, Escape and the overlay close it">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Contact Maasstad Textiles</Button>
          </DialogTrigger>
          <DialogContent title="Message Maasstad Textiles" description="They receive it in their FABRIX messages.">
            <p className="text-fx-body text-fx-ink2">A form goes here — fields, then the actions right-aligned.</p>
            <div className="mt-6 flex justify-end gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Send message</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
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

      <Row label="SurfaceSwitcher" source="components/shell/SurfaceSwitcher" hint="next to the mark, on the public bar and in the sidebar · opens the website and the Learning Hub, which carry the same switcher">
        <div className="flex items-center gap-2.5">
          <img src="/fabrix-logo.svg" alt="FABRIX" className="h-7" />
          <span aria-hidden className="h-5 w-px bg-fx-line2" />
          <SurfaceSwitcher />
        </div>
      </Row>

      <Row label="PublicHeader" source="components/shell/PublicHeader" hint="what a visitor sees on top of the landing and the marketplace · the mark goes to the landing">
        <div className="w-full overflow-hidden rounded-fx border border-fx-line">
          <PublicHeader />
        </div>
      </Row>

      <Row label="SiteFooter" source="components/shell/SiteFooter" hint="public pages only · the EU emblem and the grant disclaimer stay in full (reviewed by the project officer)">
        <div className="w-full overflow-hidden rounded-fx border border-fx-line">
          <SiteFooter />
        </div>
      </Row>
    </>
  );
}
