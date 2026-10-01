import { Link } from "@tanstack/react-router";
import { AuthShell, linkClass } from "@/features/auth/AuthShell";
import { invitationProblem } from "./api";

const COPY = {
  expired: { title: "Invitation expired", lede: "This invitation is no longer valid. Ask the person who sent it to send a new one." },
  invalid: { title: "Invalid invitation link", lede: "This link does not match any invitation. It may have been used already, or copied incompletely." },
  other: { title: "Something went wrong", lede: "The invitation could not be loaded. Try the link again in a moment." },
};

/** What an invitation page shows when the link cannot be honoured: expired, unknown, or a failure. */
export function InvitationProblem({ error }: { error: unknown }) {
  const copy = COPY[invitationProblem(error)];
  return (
    <AuthShell
      title={copy.title}
      lede={copy.lede}
      footer={
        <Link to="/login" className={linkClass}>
          Sign in
        </Link>
      }
    >
      {null}
    </AuthShell>
  );
}
