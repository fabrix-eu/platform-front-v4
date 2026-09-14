import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/shell/PagePlaceholder";

export const Route = createFileRoute("/_auth/events")({
  component: () => <PagePlaceholder title="Events" lede="Workshops, fairs and meet-ups of the circular textile ecosystem." />,
});
