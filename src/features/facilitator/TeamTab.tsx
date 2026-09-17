import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  cancelInvitation,
  grantAccess,
  inviteFacilitator,
  networkCandidatesQueryOptions,
  networkInvitationsQueryOptions,
  networkKey,
  networkMembersQueryOptions,
  removeMember,
  resendInvitation,
} from "./api";
import type { Network } from "./types";

const ROW = "flex items-center gap-3 border-t border-fx-line py-3 first:border-t-0";

export function TeamTab({ network }: { network: Network }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const slug = network.slug;

  const members = useQuery(networkMembersQueryOptions(slug));
  const candidates = useQuery(networkCandidatesQueryOptions(slug));
  const invitations = useQuery(networkInvitationsQueryOptions(slug));

  const refresh = () => queryClient.invalidateQueries({ queryKey: networkKey(slug) });
  const invite = useMutation({ mutationFn: (email: string) => inviteFacilitator(slug, email), meta: { silentErrors: true }, onSuccess: refresh });
  const grant = useMutation({ mutationFn: (userId: string) => grantAccess(slug, userId), onSuccess: refresh });
  const drop = useMutation({ mutationFn: (id: string) => removeMember(slug, id), onSuccess: refresh });
  const cancel = useMutation({ mutationFn: (id: string) => cancelInvitation(slug, id), onSuccess: refresh });
  const resend = useMutation({ mutationFn: (id: string) => resendInvitation(slug, id), onSuccess: refresh });

  return (
    <div className="mt-8 max-w-2xl space-y-6">
      <Card className="p-5">
        <Eyebrow>Has facilitator access</Eyebrow>
        <ul className="mt-3">
          {(members.data ?? []).map((member) => {
            // The API refuses both cases (403 and 422), so they are not offered.
            const isCreator = network.created_by?.id === member.user.id;
            const isLastOne = (members.data ?? []).length <= 1;

            return (
              <li key={member.id} className={ROW}>
                <Avatar name={member.user.name} src={member.user.image_url} kind="person" size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-fx-small font-bold text-fx-ink">{member.user.name}</span>
                  <span className="block truncate text-fx-label text-fx-muted">{member.user.email}</span>
                </span>
                {isCreator ? (
                  <span className="shrink-0 text-fx-label text-fx-muted uppercase">Creator</span>
                ) : (
                  <Button variant="ghost" size="sm" disabled={drop.isPending || isLastOne} onClick={() => drop.mutate(member.id)}>
                    Remove
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {(candidates.data ?? []).length > 0 && (
        <Card className="p-5">
          <Eyebrow>Other people{network.organization ? ` at ${network.organization.name}` : ""}</Eyebrow>
          <ul className="mt-3">
            {(candidates.data ?? []).map((candidate) => (
              <li key={candidate.id} className={ROW}>
                <Avatar name={candidate.name} src={candidate.image_url} kind="person" size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-fx-small font-bold text-fx-ink">{candidate.name}</span>
                  <span className="block truncate text-fx-label text-fx-muted">{candidate.email}</span>
                </span>
                <Button variant="secondary" size="sm" disabled={grant.isPending} onClick={() => grant.mutate(candidate.id)}>
                  Grant access
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {(invitations.data ?? []).length > 0 && (
        <Card className="p-5">
          <Eyebrow>Pending invitations</Eyebrow>
          <ul className="mt-3">
            {(invitations.data ?? []).map((invitation) => (
              <li key={invitation.id} className={ROW}>
                <span className="min-w-0 flex-1 truncate text-fx-small text-fx-ink2">{invitation.email}</span>
                <Button variant="ghost" size="sm" disabled={resend.isPending} onClick={() => resend.mutate(invitation.id)}>
                  Resend
                </Button>
                <Button variant="ghost" size="sm" disabled={cancel.isPending} onClick={() => cancel.mutate(invitation.id)}>
                  Cancel
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-5">
        <Eyebrow>Invite a co-facilitator</Eyebrow>
        <form
          className="mt-3 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = String(new FormData(form).get("email") ?? "").trim();
            if (!email) return;
            invite.mutate(email, {
              onSuccess: () => {
                form.reset();
                toast(`Invitation sent to ${email}`);
              },
            });
          }}
        >
          <FormError mutation={invite} fields={["email"]} />
          <Field label="Email" name="email" type="email" required autoComplete="off" mutation={invite} />
          <Button type="submit" disabled={invite.isPending}>
            {invite.isPending ? "Sending…" : "Send invitation"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
