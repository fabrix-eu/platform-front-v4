import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { meQueryOptions } from "@/lib/auth";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { FormError } from "@/components/FieldError";
import { ButtonLink } from "@/components/ui/Button";
import { AuthShell, linkClass, submitClass } from "@/features/auth/AuthShell";
import { acceptNetworkInvitation, networkInvitationQueryOptions } from "./api";
import { InvitationProblem } from "./InvitationProblem";

/**
 * The link from "You're invited to co-manage Network": accepting needs an account, so a
 * visitor is sent to sign in (and comes back here), or to create an account first.
 */
export function NetworkInvitationPage({ token }: { token: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery(networkInvitationQueryOptions(token));
  const me = useOptionalMe();
  const here = `/network-invitation?token=${token}`;
  const mutation = useMutation({
    mutationFn: () => acceptNetworkInvitation(token),
    onSuccess: async (invitation) => {
      await queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey });
      navigate({ to: "/facilitator/$networkSlug", params: { networkSlug: invitation.network.slug } });
    },
  });

  if (query.isPending) return <AuthShell title="Loading your invitation…">{null}</AuthShell>;
  if (query.isError) return <InvitationProblem error={query.error} />;

  const invitation = query.data;
  const lede = `${invitation.invited_by?.name ?? "A facilitator"} invited you to co-manage ${invitation.network.name}: its organisations, notes and tasks.`;

  if (invitation.status !== "pending") {
    return (
      <AuthShell title="Invitation already used" lede="This invitation was accepted or withdrawn." footer={<Link to="/login" className={linkClass}>Sign in</Link>}>
        {null}
      </AuthShell>
    );
  }

  if (!me) {
    return (
      <AuthShell title={`Co-manage ${invitation.network.name}`} lede={lede}>
        <div className="space-y-4">
          <p className="text-fx-body text-fx-ink2">
            Sign in to accept. No account yet? Create one with <strong>{invitation.email}</strong>, confirm your address, then open this link again.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/login" search={{ redirect: here }}>
              Sign in
            </ButtonLink>
            <ButtonLink to="/register" variant="outline">
              Create an account
            </ButtonLink>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={`Co-manage ${invitation.network.name}`} lede={lede}>
      <div className="space-y-5">
        <FormError mutation={mutation} />
        <p className="text-fx-body text-fx-ink2">
          Accepting as <strong>{me.email}</strong>. You get facilitator access to the network.
        </p>
        <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate()} className={submitClass}>
          {mutation.isPending ? "Accepting…" : "Accept the invitation"}
        </button>
      </div>
    </AuthShell>
  );
}
