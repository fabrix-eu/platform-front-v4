import { createFileRoute } from "@tanstack/react-router";
import { PublicDataPage } from "@/features/data/public/PublicDataPage";
import { dataSummaryQueryOptions } from "@/features/data/public/api";

// The presentation of the data, open to visitors. The map itself is /data/map, for members.
export const Route = createFileRoute("/_open/data")({
  loader: ({ context }) => context.queryClient.ensureQueryData(dataSummaryQueryOptions),
  component: PublicDataPage,
});
