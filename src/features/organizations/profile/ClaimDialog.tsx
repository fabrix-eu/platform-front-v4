import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { ClaimForm } from "../new/ClaimForm";
import type { OrganizationProfile } from "../types";

// For an unclaimed organisation: ask the FABRIX team to hand me the profile.
export function ClaimDialog({ org }: { org: OrganizationProfile }) {
  // Ephemeral: whether the dialog is open, and whether the claim went out.
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  if (sent) return <span className="text-fx-small font-bold text-fx-green">Claim sent — the FABRIX team reviews it</span>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <BadgeCheck className="size-4" />
          Claim this profile
        </Button>
      </DialogTrigger>
      <DialogContent title={`Claim ${org.name}`} description="Nobody manages this profile yet. If it is yours, tell the FABRIX team who you are there.">
        <ClaimForm
          organizationId={org.id}
          onDone={() => {
            setOpen(false);
            setSent(true);
            toast(`Claim on ${org.name} sent`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
