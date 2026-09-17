import { useEffect } from "react";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isFacilitator, meQueryOptions } from "@/lib/auth";

export const Route = createFileRoute("/_auth/facilitator")({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.ensureQueryData(meQueryOptions);
    if (!isFacilitator(me)) throw redirect({ to: "/" });
  },
  component: FacilitatorSpace,
});

/**
 * Everything under /facilitator wears its own tint (see `index.css`). The
 * attribute goes on <html> rather than on a wrapper element: dialogs are
 * portalled outside the shell, and would keep the platform's violet otherwise.
 */
function FacilitatorSpace() {
  useEffect(() => {
    document.documentElement.dataset.space = "facilitator";
    return () => {
      delete document.documentElement.dataset.space;
    };
  }, []);

  return <Outlet />;
}
