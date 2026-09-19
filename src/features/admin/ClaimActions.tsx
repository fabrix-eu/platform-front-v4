import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { TextareaField } from "@/components/TextareaField";
import { approveClaim, rejectClaim, type AdminClaim } from "./api";

const FORM_ID = "reject-claim";

/**
 * Approving makes the claimant an owner of that organisation, so this is the moment
 * the decision actually lands. Only a pending claim can go either way — the API says
 * so too, and refuses anything else.
 */
export function ClaimActions({ claim }: { claim: AdminClaim }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "claims"] });

  const approve = useMutation({ mutationFn: () => approveClaim(claim.id), onSuccess: refresh });
  const reject = useMutation({
    mutationFn: (reason: string) => rejectClaim(claim.id, reason),
    onSuccess: () => {
      setOpen(false);
      return refresh();
    },
  });

  if (claim.status !== "pending") {
    return (
      <span className="block text-fx-label text-fx-muted">
        {claim.reviewed_by?.name ? `by ${claim.reviewed_by.name}` : "—"}
      </span>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button size="sm" disabled={approve.isPending} onClick={() => approve.mutate()}>
        {approve.isPending ? "Approving…" : "Approve"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-fx-rose">
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent
          title={`Reject this claim?`}
          description={claim.organization ? `For ${claim.organization.name}.` : undefined}
          footer={
            <div className="flex flex-wrap justify-end gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" form={FORM_ID} variant="danger" disabled={reject.isPending}>
                {reject.isPending ? "Rejecting…" : "Reject the claim"}
              </Button>
            </div>
          }
        >
          <form
            id={FORM_ID}
            onSubmit={(event) => {
              event.preventDefault();
              const reason = String(new FormData(event.currentTarget).get("rejection_reason") ?? "").trim();
              if (reason) reject.mutate(reason);
            }}
          >
            <TextareaField
              label="Why"
              name="rejection_reason"
              required
              rows={4}
              placeholder="What the claimant needs to know — they will be told."
              mutation={reject}
            />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
