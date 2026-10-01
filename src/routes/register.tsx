import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { RegisterPage } from "@/features/organizations/signup/RegisterPage";

export const Route = createFileRoute("/register")({
  // Invitation emails sent before 2026-09-30 link here with the token; the page for it is /invitations/$token.
  validateSearch: z.object({ invitation_token: z.string().optional() }),
  beforeLoad: ({ search }) => {
    if (search.invitation_token) throw redirect({ to: "/invitations/$token", params: { token: search.invitation_token } });
  },
  component: RegisterPage,
});
