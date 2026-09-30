import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, meQueryOptions } from "@/lib/auth";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { FormError } from "@/components/FieldError";
import { Banner } from "@/components/ui/Banner";
import { AuthShell, linkClass, submitClass } from "@/features/auth/AuthShell";
import { AccountFormFields, ACCOUNT_FORM_FIELDS, readNewAccount } from "./AccountFormFields";
import { acceptClaimInvitation, claimInvitationQueryOptions, type ClaimInvitation, type NewAccount } from "./api";
import { InvitationProblem } from "./InvitationProblem";

/**
 * The link from "You're invited to claim Org": a partner created the profile and named
 * this address as the one that should run it. No review — the invitation is the
 * partner's word. Signed in with that address, one click; without an account, the
 * account is created from the link and owns the profile at once.
 */
export function ClaimInvitationPage({ token }: { token: string }) {
  const query = useQuery(claimInvitationQueryOptions(token));
  const me = useOptionalMe();

  if (query.isPending) return <AuthShell title="Loading your invitation…">{null}</AuthShell>;
  if (query.isError) return <InvitationProblem error={query.error} />;

  const invitation = query.data;
  const lede = `${invitation.invited_by.name} added ${invitation.organization.name} to FABRIX and named you to run its profile.`;
  const signInHere = (
    <Link to="/login" search={{ redirect: `/claim-organization?token=${token}` }} className={linkClass}>
      Sign in
    </Link>
  );

  if (me && me.email.toLowerCase() !== invitation.email.toLowerCase()) {
    return (
      <AuthShell title="Another address" lede={lede} footer={signInHere}>
        <Banner tone="warning">
          This invitation was sent to <strong>{invitation.email}</strong>, and you are signed in as {me.email}. Sign in with the invited address to claim the profile.
        </Banner>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={`Claim ${invitation.organization.name}`}
      lede={lede}
      footer={
        me ? null : (
          <>
            Already have an account with {invitation.email}? {signInHere}
          </>
        )
      }
    >
      {me ? <ClaimAsMe token={token} invitation={invitation} /> : <ClaimWithAccount token={token} invitation={invitation} />}
    </AuthShell>
  );
}

function goToProfile(slug: string | undefined, navigate: ReturnType<typeof useNavigate>) {
  if (slug) navigate({ to: "/$orgSlug/profile", params: { orgSlug: slug } });
  else navigate({ to: "/" });
}

function ClaimAsMe({ token, invitation }: { token: string; invitation: ClaimInvitation }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => acceptClaimInvitation(token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryOptions.queryKey });
      goToProfile(invitation.organization.slug, navigate);
    },
  });
  return (
    <div className="space-y-5">
      <FormError mutation={mutation} />
      <p className="text-fx-body text-fx-ink2">You become the owner of the profile: its details, its listings, its team.</p>
      <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate()} className={submitClass}>
        {mutation.isPending ? "Claiming…" : "Claim this profile"}
      </button>
    </div>
  );
}

function ClaimWithAccount({ token, invitation }: { token: string; invitation: ClaimInvitation }) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (account: NewAccount) => {
      await acceptClaimInvitation(token, { ...account, email: invitation.email });
      await login(invitation.email, account.password);
    },
    onSuccess: () => goToProfile(invitation.organization.slug, navigate),
  });
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(readNewAccount(new FormData(e.currentTarget)));
      }}
    >
      <FormError mutation={mutation} fields={ACCOUNT_FORM_FIELDS} />
      <AccountFormFields email={invitation.email} mutation={mutation} />
      <button type="submit" disabled={mutation.isPending} className={submitClass}>
        {mutation.isPending ? "Creating your account…" : "Create my account and claim the profile"}
      </button>
    </form>
  );
}
