import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { unclaimOrganization } from "../api";
import type { OrganizationProfile } from "../types";

/**
 * The way out for someone who added an organisation and no longer wants to manage it.
 *
 * It gives the profile back rather than deleting it: the entry returns to the
 * directory unclaimed, which is what it was before anyone claimed it, and the real
 * owners can still take it later. Deleting would take the connections other
 * organisations declared toward it and the records facilitators keep about it — work
 * that is not the person leaving's to destroy.
 *
 * Shown only to the last member: with colleagues still on the team, leaving would
 * evict them too, so the API refuses and they hand it over first.
 */
export function LeaveOrganization({ org }: { org: OrganizationProfile }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const leave = useMutation({
    mutationFn: () => unclaimOrganization(org.id),
    onSuccess: async () => {
      // The membership is gone, so the session's own idea of which organisations are
      // yours is stale — and with it the sidebar, the switcher and the profile.
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      await navigate({ to: "/" });
    },
  });

  return (
    <section className="max-w-2xl border-t border-fx-line pt-8">
      <h2 className="text-fx-heading text-fx-rose">Give up this profile</h2>
      <p className="mt-2 text-fx-body text-fx-ink2">
        You are the last person on this team. Giving up {org.name} puts it back in the directory as an
        unclaimed profile — it stays on the map, and whoever really runs it can claim it later.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="mt-4 text-fx-rose">
            Give up this profile
          </Button>
        </DialogTrigger>
        <DialogContent
          title={`Give up ${org.name}?`}
          description="The profile stays in the directory, unclaimed. You stop managing it."
          footer={
            <div className="flex flex-wrap justify-end gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Keep managing it</Button>
              </DialogClose>
              <Button variant="danger" disabled={leave.isPending} onClick={() => leave.mutate()}>
                {leave.isPending ? "Giving it up…" : "Give it up"}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-fx-body text-fx-ink2">
            <p>
              <span className="font-bold text-fx-ink">What goes:</span> your place on the team, the figures only
              members could see — people, turnover, registration details, facilities and processes — the Compass
              answers, and the listings. An offer with nobody behind it should not keep asking.
            </p>
            <p>
              <span className="font-bold text-fx-ink">What stays:</span> the public profile itself, the connections
              other organisations declared toward it, and what facilitators have recorded about it. None of that is
              yours to remove.
            </p>
            <p>This cannot be undone from here: taking it back means claiming it again.</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
