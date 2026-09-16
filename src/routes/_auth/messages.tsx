import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MessagesPage } from "@/features/messages/MessagesPage";
import { conversationsQueryOptions } from "@/features/messages/api";

const searchSchema = z.object({ conversation: z.string().optional() });

export const Route = createFileRoute("/_auth/messages")({
  validateSearch: searchSchema,
  loader: ({ context }) => context.queryClient.ensureQueryData(conversationsQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const { conversation } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <MessagesPage
      selectedId={conversation}
      onSelect={(id) => navigate({ search: { conversation: id }, replace: true })}
    />
  );
}
