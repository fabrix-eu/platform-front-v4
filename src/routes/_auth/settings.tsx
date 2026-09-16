import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SettingsPage } from "@/features/settings/SettingsPage";

const searchSchema = z.object({ tab: z.enum(["account", "notifications"]).optional() });

export const Route = createFileRoute("/_auth/settings")({
  validateSearch: searchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { tab = "account" } = Route.useSearch();
  const navigate = Route.useNavigate();

  return <SettingsPage tab={tab} onTabChange={(next) => navigate({ search: { tab: next }, replace: true })} />;
}
