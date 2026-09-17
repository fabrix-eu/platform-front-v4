import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { networkKey } from "../api";
import { unfollowOrganization } from "./api";

interface UnfollowButtonProps {
  networkSlug: string;
  recordId: string;
  organizationName: string;
}

/** Unfollowing takes the CRM data with it, so it asks first. */
export function UnfollowButton({ networkSlug, recordId, organizationName }: UnfollowButtonProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const unfollow = useMutation({
    mutationFn: () => unfollowOrganization(networkSlug, recordId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: networkKey(networkSlug) });
      await navigate({ to: "/facilitator/$networkSlug", params: { networkSlug }, search: { tab: "organisations" } });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-fx-rose">
          Unfollow
        </Button>
      </DialogTrigger>
      <DialogContent
        title={`Stop following ${organizationName}?`}
        description="Your notes, the needs you assessed and the logged interactions go with it."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Keep following</Button>
            </DialogClose>
            <Button variant="danger" disabled={unfollow.isPending} onClick={() => unfollow.mutate()}>
              {unfollow.isPending ? "Removing…" : "Unfollow"}
            </Button>
          </div>
        }
      >
        <p className="text-fx-body text-fx-ink2">
          The organisation itself stays on FABRIX — only what this network keeps about it is deleted.
        </p>
      </DialogContent>
    </Dialog>
  );
}
