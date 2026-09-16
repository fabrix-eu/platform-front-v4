import { createFileRoute } from "@tanstack/react-router";
import { compassFormQueryOptions } from "@/features/compass/api";
import { CompassFormPage } from "@/features/compass/CompassFormPage";

export const Route = createFileRoute("/_auth/$orgSlug/assessments/$formKey")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(compassFormQueryOptions(params.formKey)),
  component: CompassFormPage,
});
