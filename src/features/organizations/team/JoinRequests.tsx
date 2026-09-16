import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormError } from "@/components/FieldError";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { acceptJoinRequest, declineJoinRequest, joinRequestsQueryOptions, type JoinRequest } from "./api";

function DeclineDialog({ organizationId, request }: { organizationId: string; request: JoinRequest }) {
  // Ephemeral: the dialog.
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (reason: string) => declineJoinRequest(organizationId, request.id, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", organizationId, "team"] });
      setOpen(false);
      toast(`${request.user.name}'s request was declined`);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) mutation.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent title={`Decline ${request.user.name}`} description="They receive your reason, so write something they can act on.">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(String(new FormData(e.currentTarget).get("decline_reason") ?? "").trim());
          }}
        >
          <FormError mutation={mutation} />
          <TextareaField label="Why?" name="decline_reason" required hint="For example: we only add people who work here." mutation={mutation} />
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="danger" disabled={mutation.isPending}>
              {mutation.isPending ? "Declining…" : "Decline request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** People asking to join the organisation. Owners accept or decline them. */
export function JoinRequests({ organizationId }: { organizationId: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data } = useQuery(joinRequestsQueryOptions(organizationId));
  const pending = (data ?? []).filter((r) => r.status === "pending");

  const accept = useMutation({
    mutationFn: (request: JoinRequest) => acceptJoinRequest(organizationId, request.id),
    onSuccess: async (_data, request) => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", organizationId, "team"] });
      toast(`${request.user.name} joined the team`);
    },
  });

  if (pending.length === 0) return null;

  return (
    <section aria-labelledby="join-requests-title">
      <Eyebrow id="join-requests-title" className="text-fx-emphasis">
        {pending.length === 1 ? "1 person wants to join" : `${pending.length} people want to join`}
      </Eyebrow>
      <Card className="mt-3 p-0">
        <ul>
          {pending.map((request) => (
            <li key={request.id} className="flex flex-wrap items-center gap-3 border-t border-fx-line px-4 py-3.5 first:border-t-0 sm:px-5">
              <Avatar name={request.user.name} src={request.user.image_url} kind="person" size="sm" />
              <div className="min-w-0 flex-1 basis-60">
                <p className="text-fx-body">
                  <span className="font-bold text-fx-ink">{request.user.name}</span>
                  <span className="text-fx-muted"> · {request.user.email}</span>
                </p>
                {request.message && <p className="mt-1 text-fx-small text-fx-ink2">“{request.message}”</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DeclineDialog organizationId={organizationId} request={request} />
                <Button size="sm" disabled={accept.isPending} onClick={() => accept.mutate(request)}>
                  Accept
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <FormError mutation={accept} />
    </section>
  );
}
