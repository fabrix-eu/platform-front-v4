import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS_FEATURES } from "./features";

/**
 * The heart of the landing: horizontal bands, one per thing FABRIX does, each in its
 * own colour. The colour is the divider — the sections are read one after another
 * rather than compared side by side, which is why this is a stack and not a grid.
 */
export function BusinessFeatures({ className }: { className?: string }) {
  return (
    <section aria-labelledby="business-title" className={className}>
      <h2 id="business-title" className="font-fx-display text-fx-display text-fx-ink">
        For your business
      </h2>

      <div className="mt-9 flex flex-col gap-4">
        {BUSINESS_FEATURES.map((feature) => (
          <div
            key={feature.kicker}
            className="flex flex-col gap-4 rounded-fx-lg border border-fx-line bg-fx-paper p-5 sm:flex-row sm:items-start sm:gap-6 sm:p-6"
          >
            <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-fx", feature.tile)}>
              <feature.icon aria-hidden className="size-6" strokeWidth={2.1} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-fx-display text-fx-label text-fx-muted uppercase">{feature.kicker}</p>
              <h3 className="mt-1 font-fx-display text-fx-heading text-fx-ink">{feature.title}</h3>
              <p className="mt-2 max-w-prose text-fx-body text-fx-ink2">{feature.body}</p>

              {feature.href ? (
                <a
                  href={feature.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-fx-small font-bold text-fx-emphasis hover:underline"
                >
                  {feature.cta}
                  <ArrowUpRight aria-hidden className="size-4" strokeWidth={2.4} />
                </a>
              ) : (
                feature.to && (
                  <Link
                    to={feature.to}
                    className="mt-4 inline-flex items-center gap-1.5 text-fx-small font-bold text-fx-emphasis hover:underline"
                  >
                    {feature.cta}
                    <ArrowRight aria-hidden className="size-4" strokeWidth={2.4} />
                  </Link>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
