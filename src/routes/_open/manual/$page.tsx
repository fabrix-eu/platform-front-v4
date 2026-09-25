import { createFileRoute, notFound } from "@tanstack/react-router";
import { manualPageSchema } from "@/features/manual/contents";
import { ManualLayout } from "@/features/manual/ManualLayout";
import { PAGES } from "@/features/manual/pages/index";
import { InProgress } from "@/features/manual/pages/InProgress";

// Open to visitors: the manual is worth reading before signing up, and `_open`
// gives it the app's frame once you are signed in.
export const Route = createFileRoute("/_open/manual/$page")({
  beforeLoad: ({ params }) => {
    if (!manualPageSchema.safeParse(params.page).success) throw notFound();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { page } = Route.useParams();
  const parsed = manualPageSchema.parse(page);
  const Page = PAGES[parsed];

  return <ManualLayout page={parsed}>{Page ? <Page /> : <InProgress page={parsed} />}</ManualLayout>;
}
