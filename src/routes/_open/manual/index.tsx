import { createFileRoute } from "@tanstack/react-router";
import { ManualLayout } from "@/features/manual/ManualLayout";
import { Overview } from "@/features/manual/pages/Overview";

// The manual opens on its plan: four sections, each for one kind of need.
export const Route = createFileRoute("/_open/manual/")({
  component: () => (
    <ManualLayout>
      <Overview />
    </ManualLayout>
  ),
});
