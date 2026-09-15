import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PublicHeader } from "@/components/shell/PublicHeader";
import { SiteFooter } from "@/components/shell/SiteFooter";
import { buttonClass, ButtonLink } from "@/components/ui/Button";
import { AUDIENCES } from "./audiences";

const COLUMN = "mx-auto max-w-6xl px-4 sm:px-8 lg:px-12";

// The landing — the only page of the app a logged-out visitor starts on, and the top of
// the funnel. Built from the "Landing" screen of the design system: hero, the three
// audiences, the pilot notice, about.
export function LandingPage() {
  return (
    <div className="min-h-screen bg-fx-panel">
      <PublicHeader />
      <main>
        {/* The brand block at full strength — the one place violet gets a whole band. */}
        <section className="bg-fx-emphasis text-fx-emphasis-ink">
          <div className={cn(COLUMN, "py-16 sm:py-20 lg:py-24")}>
            <p className="font-fx-display text-fx-label uppercase opacity-70">Funded by the European Union · piloting in Rotterdam &amp; Athens</p>
            <h1 className="mt-6 max-w-[14ch] font-fx-display text-fx-hero">Map, match, make.</h1>
            <p className="mt-6 max-w-xl text-fx-lead opacity-90">
              FABRIX connects the organisations and facilitators of the textile and clothing industry, so that supply chains can be rebuilt
              locally, circularly, city by city.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-fx-action bg-fx-emphasis-ink px-5 py-3 text-fx-body font-bold text-fx-emphasis hover:brightness-95"
              >
                Get started
                <ArrowRight aria-hidden className="size-4" strokeWidth={2.6} />
              </Link>
              <Link to="/login" className="rounded-fx-action border-2 border-fx-emphasis-ink/45 px-5 py-3 text-fx-body font-bold hover:bg-fx-emphasis-ink/10">
                Sign in
              </Link>
              <Link to="/marketplace" className="px-2 py-3 text-fx-body font-bold underline-offset-4 opacity-90 hover:underline">
                Browse the marketplace
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="audiences-title" className={cn(COLUMN, "py-12 sm:py-16")}>
          <h2 id="audiences-title" className="font-fx-display text-fx-display text-fx-ink">
            Who is FABRIX for?
          </h2>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.title} className="flex flex-col rounded-fx-lg border border-fx-line bg-fx-paper p-5">
                <span className={cn("flex size-11 items-center justify-center rounded-fx", a.tile)}>
                  <a.icon aria-hidden className="size-5" strokeWidth={2.1} />
                </span>
                <h3 className="mt-4 font-fx-display text-fx-heading text-fx-ink">{a.title}</h3>
                <p className="mt-2 text-fx-small text-fx-ink2">{a.blurb}</p>
                <ul className="mt-4 mb-5 grid gap-2.5 border-t border-fx-line pt-4">
                  {a.points.map((p) => (
                    <li key={p.text} className="flex items-start gap-2 text-fx-small text-fx-ink2">
                      <p.icon aria-hidden className="mt-0.5 size-3.5 shrink-0 text-fx-muted" />
                      {p.text}
                    </li>
                  ))}
                </ul>
                {a.contactEmail ? (
                  <a
                    href={`mailto:${a.contactEmail}?subject=${encodeURIComponent("Becoming a FABRIX facilitator")}`}
                    className={buttonClass({ size: "sm", className: "mt-auto justify-center text-center" })}
                  >
                    {a.cta}
                  </a>
                ) : (
                  <ButtonLink to="/register" size="sm" className="mt-auto justify-center">
                    {a.cta}
                  </ButtonLink>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-fx-paper">
          <div className={cn(COLUMN, "py-12 sm:py-16")}>
            <div className="flex flex-wrap items-center gap-4 rounded-fx-lg bg-fx-amber-soft px-5 py-4">
              <span className="font-fx-display text-fx-label text-fx-amber uppercase">Beta</span>
              <p className="max-w-2xl text-fx-body text-fx-ink">
                FABRIX is piloting in two cities — Rotterdam and Athens — with the textile and clothing industry. Other regions and industries follow.
              </p>
            </div>

            <div className="mt-12 max-w-prose">
              <h2 className="font-fx-display text-fx-title text-fx-ink">About FABRIX</h2>
              <p className="mt-4 text-fx-body text-fx-ink2">
                A European Union funded project studying how to encourage sustainable urban manufacturing. We map where textile production actually
                happens in cities, then work with local administrations, urban planners and facilitators to help businesses get past what blocks them.
              </p>
              <p className="mt-3 text-fx-body text-fx-ink2">
                We imagine a city where fashion is local and meaningful, where fast fashion is out of fashion, and where waste is a resource.
              </p>
              <a
                href="https://www.fabrixproject.eu/about"
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass({ variant: "secondary", size: "sm", className: "mt-6 inline-flex items-center gap-2" })}
              >
                Read more about FABRIX
                <ArrowRight aria-hidden className="size-3.5" strokeWidth={2.4} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
