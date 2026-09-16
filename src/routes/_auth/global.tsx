import { createFileRoute } from "@tanstack/react-router";
import { DirectoryPage } from "@/features/directory/DirectoryPage";
import { directorySearchSchema } from "@/features/directory/search";

export const Route = createFileRoute("/_auth/global")({
  validateSearch: directorySearchSchema,
  component: DirectoryPage,
});
