import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { queryClient } from "@/lib/queryClient";
import { startAnalytics } from "@/lib/analytics";
import { handleExpiredSessions } from "@/lib/session";
import { routeTree } from "./routeTree.gen";
import "./index.css";

function RoutePending() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-fx-line border-t-fx-emphasis" />
    </div>
  );
}

const router = createRouter({
  routeTree,
  defaultPreload: "render",
  defaultPendingComponent: RoutePending,
  defaultPendingMs: 150,
  defaultPendingMinMs: 200,
  scrollRestoration: true,
  context: { queryClient },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

startAnalytics(router);
handleExpiredSessions(router);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
