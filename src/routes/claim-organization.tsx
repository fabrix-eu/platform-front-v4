import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ClaimInvitationPage } from "@/features/invitations/ClaimInvitationPage";
import { InvitationProblem } from "@/features/invitations/InvitationProblem";
import { ApiError } from "@/lib/api";

// The link in "You're invited to claim Org" (organization_mailer#claim_invitation_email).
export const Route = createFileRoute("/claim-organization")({
  validateSearch: z.object({ token: z.string().optional() }),
  component: RouteComponent,
});

function RouteComponent() {
  const { token } = Route.useSearch();
  if (!token) return <InvitationProblem error={new ApiError(404, {})} />;
  return <ClaimInvitationPage token={token} />;
}
