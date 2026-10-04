import { CheckCircle2, Plus } from "lucide-react";
import { Banner } from "@/components/ui/Banner";
import { Button, ButtonLink } from "@/components/ui/Button";
import type { Added } from "./api";

interface AddedStepProps {
  networkSlug: string;
  added: Added;
  invited?: string;
  onAddAnother: () => void;
}

export function AddedStep({ networkSlug, added, invited, onAddAnother }: AddedStepProps) {
  const name = added.record.organization.name;

  return (
    <div className="flex flex-col items-center py-6 text-center">
      <CheckCircle2 aria-hidden className="size-12 text-fx-green" strokeWidth={1.75} />
      <p className="mt-5 text-fx-title text-fx-ink">{name} is in your network</p>
      <p className="mt-3 max-w-md text-fx-body text-fx-ink2">
        {invited && !added.warning
          ? `We invited ${invited} to claim its profile and join FABRIX.`
          : "Its record is ready for your notes, its needs and your interactions."}
      </p>
      {added.warning && (
        <Banner tone="info" className="mt-5 max-w-md text-left">
          No invitation sent: {added.warning.toLowerCase()}.
        </Banner>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/facilitator/$networkSlug/organizations/$recordId" params={{ networkSlug, recordId: added.record.id }}>
          Open its record
        </ButtonLink>
        <Button variant="ghost" onClick={onAddAnother}>
          <Plus className="size-4" strokeWidth={2.6} />
          Add another
        </Button>
      </div>
    </div>
  );
}
