import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, linkClass } from "@/features/auth/AuthShell";

export const Route = createFileRoute("/verify-instructions")({
  component: VerifyInstructionsPage,
});

function VerifyInstructionsPage() {
  return (
    <AuthShell
      title="Check your inbox"
      lede="We sent you a verification email. Click the link inside to activate your account."
      footer={
        <Link to="/login" className={linkClass}>
          Back to sign in
        </Link>
      }
    >
      {null}
    </AuthShell>
  );
}
