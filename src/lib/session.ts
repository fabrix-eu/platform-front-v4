import type { AnyRouter } from "@tanstack/react-router";
import { setSessionExpiredHandler } from "./api";
import { queryClient } from "./queryClient";

/**
 * An expired session (the refresh token was refused; the tokens are already cleared):
 * - on a signed-in page (`_auth`), go to /login;
 * - on a page visitors can see (landing, marketplace, a public profile), stay: the
 *   visitor is simply no longer signed in, and the page falls back to its public frame.
 */
export function handleExpiredSessions(router: AnyRouter) {
  setSessionExpiredHandler(() => {
    // The page being shown, or being loaded when it happens during a navigation.
    const matches = router.matchRoutes(router.latestLocation);
    const onSignedInPage = matches.some((match) => match.routeId.startsWith("/_auth"));

    if (onSignedInPage) {
      // Leave the page first: its shell still reads the user.
      void router.navigate({ to: "/login" }).then(() => queryClient.removeQueries({ queryKey: ["me"] }));
    } else {
      // Reset, not remove: removing drops the cached user without re-rendering the pages
      // showing it, so the signed-in frame would stay on screen.
      void queryClient.resetQueries({ queryKey: ["me"] });
    }
  });
}
