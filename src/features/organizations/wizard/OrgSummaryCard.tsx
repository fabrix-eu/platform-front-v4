import { Avatar } from "@/components/ui/Avatar";

interface OrgSummaryCardProps {
  name: string;
  /** Where it sits in the value chain, already a label. */
  position?: string | null;
  address?: string | null;
  imageUrl?: string | null;
}

export function OrgSummaryCard({ name, position, address, imageUrl }: OrgSummaryCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-fx border border-fx-line bg-fx-panel p-4">
      <Avatar name={name} src={imageUrl} />
      <div className="min-w-0">
        <p className="truncate text-fx-body font-bold text-fx-ink">{name}</p>
        <p className="truncate text-fx-small text-fx-muted">{[position, address].filter(Boolean).join(" · ")}</p>
      </div>
    </div>
  );
}
