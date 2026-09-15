import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { inviteColleague } from "./api";

export function InviteColleagueDialog({ organizationId, organizationName }: { organizationId: string; organizationName: string }) {
  // Ephemeral: whether the dialog is open.
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (email: string) => inviteColleague(organizationId, email),
    meta: { silentErrors: true },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["organizations", organizationId, "team"] });
      setOpen(false);
      toast(result.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) mutation.reset(); }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" strokeWidth={2.6} />
          Invite colleague
        </Button>
      </DialogTrigger>
      <DialogContent title="Invite a colleague" description={`They can edit ${organizationName}'s profile, post listings and manage connections.`}>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(String(new FormData(e.currentTarget).get("email") ?? "").trim());
          }}
        >
          <FormError mutation={mutation} fields={["email"]} />
          <Field label="Their email" name="email" type="email" required autoComplete="off" placeholder="colleague@yourorganisation.eu" mutation={mutation} />
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending…" : "Send invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
