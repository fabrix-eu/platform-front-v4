import type { AnyRouter } from "@tanstack/react-router";

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

// Cookieless Matomo (no consent banner needed). Only runs when the build sets
// VITE_MATOMO_URL and VITE_MATOMO_SITE_ID — see the deploy workflow.
export function startAnalytics(router: AnyRouter): void {
  const url = import.meta.env.VITE_MATOMO_URL;
  const siteId = import.meta.env.VITE_MATOMO_SITE_ID;
  if (!url || !siteId) return;

  const paq = (window._paq = window._paq || []);
  paq.push(["disableCookies"]);
  paq.push(["enableLinkTracking"]);
  paq.push(["setTrackerUrl", `${url}matomo.php`]);
  paq.push(["setSiteId", siteId]);

  const script = document.createElement("script");
  script.async = true;
  script.src = `${url}matomo.js`;
  document.head.appendChild(script);

  router.subscribe("onResolved", () => {
    window._paq?.push(["setCustomUrl", window.location.href]);
    window._paq?.push(["trackPageView"]);
  });
}
