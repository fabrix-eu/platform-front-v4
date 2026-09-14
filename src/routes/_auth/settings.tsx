import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/settings")({
  component: () => <PagePlaceholder title="Settings" lede="Your account, password and email preferences." />,
});
