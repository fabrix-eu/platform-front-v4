import { createFileRoute } from "@tanstack/react-router";
import { CompassPage } from "@/features/compass/CompassPage";

export const Route = createFileRoute("/_auth/$orgSlug/assessments/")({
  component: CompassPage,
});
