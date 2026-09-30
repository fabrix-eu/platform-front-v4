import { createFileRoute } from "@tanstack/react-router";
import { MemberInvitationPage } from "@/features/invitations/MemberInvitationPage";

// The link in "X invited you to join Org" (organization_mailer#invitation_email).
export const Route = createFileRoute("/invitations/$token")({
  component: () => <MemberInvitationPage token={Route.useParams().token} />,
});
