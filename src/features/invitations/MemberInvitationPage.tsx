import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { login } from "@/lib/auth";
import { FormError } from "@/components/FieldError";
import { AuthShell, linkClass, submitClass } from "@/features/auth/AuthShell";
import { AccountFormFields, ACCOUNT_FORM_FIELDS, readNewAccount } from "./AccountFormFields";
import { acceptMemberInvitation, memberInvitationQueryOptions, type NewAccount } from "./api";
import { InvitationProblem } from "./InvitationProblem";

const ROLE_LABEL = { owner: "an owner", admin: "a manager", member: "a member" } as const;

/**
 * The link from "X invited you to join Org": the invitee creates their account here, in
 * the invitation's name, and lands in the organisation signed in. Someone who already
 * had an account was added at once and never gets this link.
 */
export function MemberInvitationPage({ token }: { token: string }) {
  const navigate = useNavigate();
  const query = useQuery(memberInvitationQueryOptions(token));
  const mutation = useMutation({
    mutationFn: async (account: NewAccount) => {
      const invitation = query.data!;
      await acceptMemberInvitation(token, invitation.email, account);
      // The acceptance answers an access token only: a proper sign-in gives the session its refresh token too.
      await login(invitation.email, account.password);
      return invitation;
    },
    onSuccess: (invitation) => {
      const slug = invitation.organization.slug;
      if (slug) navigate({ to: "/$orgSlug/dashboard", params: { orgSlug: slug } });
      else navigate({ to: "/" });
    },
  });

  if (query.isPending) return <AuthShell title="Loading your invitation…">{null}</AuthShell>;
  if (query.isError) return <InvitationProblem error={query.error} />;

  const invitation = query.data;
  return (
    <AuthShell
      title="Accept the invitation"
      lede={`${invitation.invited_by.name} invited you to join ${invitation.organization.name} as ${ROLE_LABEL[invitation.role] ?? "a member"}. Create your account and you are in.`}
      footer={
        <>
          Already have an account with another address?{" "}
          <Link to="/login" className={linkClass}>
            Sign in
          </Link>
        </>
      }
    >
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
          {mutation.isPending ? "Creating your account…" : "Accept and create my account"}
        </button>
      </form>
    </AuthShell>
  );
}
