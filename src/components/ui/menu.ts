// Classes for Radix DropdownMenu parts (@radix-ui/react-dropdown-menu), so every
// menu in the app — org switcher, user menu, row actions — looks the same.

export const menuContentClass =
  "z-50 min-w-60 rounded-fx border border-fx-line bg-fx-paper p-1.5 shadow-lg shadow-fx-ink/5";

export const menuItemClass =
  "flex cursor-pointer items-center gap-3 rounded-fx-sm px-2.5 py-2 text-fx-body text-fx-ink outline-none " +
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-fx-panel";

export const menuDangerItemClass = `${menuItemClass} text-fx-rose data-[highlighted]:bg-fx-rose-soft`;

export const menuLabelClass = "px-2.5 pt-2 pb-1.5 font-fx-display text-fx-label text-fx-muted uppercase";

export const menuSeparatorClass = "my-1.5 h-px bg-fx-line";
