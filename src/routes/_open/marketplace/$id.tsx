import { createFileRoute } from "@tanstack/react-router";
import { listingQueryOptions } from "@/features/listings/api";
import { ListingDetailPage, ListingNotFound } from "@/features/listings/detail/ListingDetailPage";

export const Route = createFileRoute("/_open/marketplace/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(listingQueryOptions(params.id)),
  component: ListingDetailPage,
  errorComponent: ListingNotFound,
});
