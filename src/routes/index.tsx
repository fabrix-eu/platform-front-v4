import { createFileRoute, redirect } from "@tanstack/react-router";
import { tokens } from "@/lib/api";
import { meQueryOptions } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";
import { LandingPage } from "@/features/landing/LandingPage";

export const Route = createFileRoute("/")({
  // Visitors get the landing. Signed in, "/" is still the way home: the organisation's
  // dashboard, or /home without one. An expired session just means "visitor"
  // (lib/session.ts).
  beforeLoad: async ({ context }) => {
    if (!tokens.access()) return;
    const me = await context.queryClient.ensureQueryData(meQueryOptions).catch(() => undefined);
    if (!me) return;
    const org = resolveCurrentOrg(me);
    if (org) throw redirect({ to: "/$orgSlug/dashboard", params: { orgSlug: org.organization_slug } });
    throw redirect({ to: "/home" });
  },
  component: LandingPage,
});
