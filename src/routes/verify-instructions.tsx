import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell, linkClass } from "@/features/auth/AuthShell";
import { ResendVerification } from "@/features/auth/ResendVerification";

export const Route = createFileRoute("/verify-instructions")({
  component: VerifyInstructionsPage,
});

function VerifyInstructionsPage() {
  return (
    <AuthShell
      title="Check your inbox"
      lede="We sent you a verification email. Click the link inside to activate your account — you cannot sign in before."
      footer={
        <Link to="/login" className={linkClass}>
          Back to sign in
        </Link>
      }
    >
      <p className="mb-4 text-fx-body text-fx-ink2">
        Nothing after a few minutes, not even in spam? Enter your address and we send the link again.
      </p>
      <ResendVerification />
    </AuthShell>
  );
}
