import { createFileRoute, notFound } from "@tanstack/react-router";
import { manualPageSchema } from "@/features/manual/contents";
import { ManualLayout } from "@/features/manual/ManualLayout";
import { GettingStarted } from "@/features/manual/pages/GettingStarted";
import { WhatYouDo } from "@/features/manual/pages/WhatYouDo";
import { YourProfile } from "@/features/manual/pages/YourProfile";

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

  return (
    <ManualLayout page={parsed}>
      {parsed === "getting-started" && <GettingStarted />}
      {parsed === "your-profile" && <YourProfile />}
      {parsed === "what-you-do" && <WhatYouDo />}
    </ManualLayout>
  );
}
