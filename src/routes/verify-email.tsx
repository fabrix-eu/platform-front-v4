import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { AuthShell, linkClass } from "@/features/auth/AuthShell";
import { verifyEmail } from "@/features/auth/api";

export const Route = createFileRoute("/verify-email")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  // A query, not a mutation: the link is opened once and the result is what the page shows.
  const query = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token!),
    enabled: !!token,
    staleTime: Infinity,
  });

  const signIn = (
    <Link to="/login" className={linkClass}>
      Sign in
    </Link>
  );

  if (token && query.isPending) {
    return <AuthShell title="Verifying your email…">{null}</AuthShell>;
  }

  if (!token || query.isError) {
    return (
      <AuthShell
        title="Invalid link"
        lede="This verification link is invalid or has expired."
        footer={signIn}
      >
        {null}
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Email verified" lede="Your account is active. You can sign in now." footer={signIn}>
      {null}
    </AuthShell>
  );
}
