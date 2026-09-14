import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { meQueryOptions } from "@/lib/auth";

export const Route = createFileRoute("/_auth/")({
  component: HomePage,
});

// Scaffold placeholder: proves the auth round-trip against the Fabrix API.
function HomePage() {
  const { data: me } = useSuspenseQuery(meQueryOptions);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-fx-display text-fx-label text-fx-muted uppercase">platform-front-v4</p>
      <h1 className="mt-4 text-fx-display text-fx-ink">Hello, {me.name}.</h1>
      <p className="mt-4 max-w-2xl text-fx-lead text-fx-ink2">
        The new front is wired to the API. {me.organizations.length} organisation
        {me.organizations.length === 1 ? "" : "s"} on your account.
      </p>
    </div>
  );
}
