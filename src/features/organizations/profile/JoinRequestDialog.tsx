import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { FormError } from "@/components/FieldError";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { myJoinRequestsQueryOptions, requestToJoin } from "../joinRequests";
import type { OrganizationProfile } from "../types";

// For a managed organisation: ask its owners to add me to the team.
export function JoinRequestDialog({ org }: { org: OrganizationProfile }) {
  // Ephemeral: whether the dialog is open.
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mine = useQuery(myJoinRequestsQueryOptions);
  const mutation = useMutation({
    mutationFn: (message: string) => requestToJoin(org.id, message),
    meta: { silentErrors: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myJoinRequestsQueryOptions.queryKey });
      setOpen(false);
      toast(`Request sent to ${org.name}`);
    },
  });

  if (mine.data?.some((r) => r.organization.id === org.id && r.status === "pending")) {
    return <Badge tone="amber">Join request pending</Badge>;
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) mutation.reset(); }}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <UserPlus className="size-4" />
          Request to join
        </Button>
      </DialogTrigger>
      <DialogContent title={`Join ${org.name}`} description="Its owners review your request. Once accepted, you manage the profile with them.">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(String(new FormData(e.currentTarget).get("message") ?? "").trim());
          }}
        >
          <FormError mutation={mutation} fields={["message"]} />
          <TextareaField label="Your message" name="message" required rows={4} placeholder="Who you are and your role there…" mutation={mutation} />
          <p className="-mt-2 text-fx-small text-fx-muted">At least 10 characters.</p>
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending…" : "Send request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
