import { createFileRoute, Outlet } from "@tanstack/react-router";
import { tokens } from "@/lib/api";
import { meQueryOptions } from "@/lib/auth";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { AppShell } from "@/components/shell/AppShell";
import { PublicShell } from "@/components/shell/PublicShell";

// Pages open to visitors. Signed in, they get the app's sidebar; otherwise the
// public frame. Never redirects: a missing or dead session just means "visitor".
export const Route = createFileRoute("/_open")({
  beforeLoad: async ({ context }) => {
    if (!tokens.access()) return;
    await context.queryClient.ensureQueryData(meQueryOptions).catch(() => undefined);
  },
  component: OpenLayout,
});

function OpenLayout() {
  const me = useOptionalMe();
  return me ? (
    <AppShell>
      <Outlet />
    </AppShell>
  ) : (
    <PublicShell>
      <Outlet />
    </PublicShell>
  );
}
