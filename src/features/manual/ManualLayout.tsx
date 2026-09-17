import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { entryFor, MANUAL, neighbours, sectionOf, type ManualPage } from "./contents";

/** The manual's own frame: the contents beside the page, and a way to read on. */
export function ManualLayout({ page, children }: { page: ManualPage; children: ReactNode }) {
  const entry = entryFor(page);
  const { previous, next } = neighbours(page);

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Manual contents" className="lg:sticky lg:top-8 lg:self-start">
        <Eyebrow className="mb-4">User manual</Eyebrow>
        <div className="flex flex-col gap-6">
          {MANUAL.map((section) => (
            <div key={section.title}>
              <p className="mb-2 font-fx-display text-fx-label text-fx-muted uppercase">{section.title}</p>
              <ul className="flex flex-col gap-0.5">
                {section.entries.map((item) => (
                  <li key={item.page}>
                    <Link
                      to="/manual/$page"
                      params={{ page: item.page }}
                      className={cn(
                        "block rounded-fx px-3 py-2 text-fx-body transition",
                        item.page === page
                          ? "bg-fx-emphasis font-bold text-fx-emphasis-ink"
                          : "text-fx-ink2 hover:bg-fx-paper hover:text-fx-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="min-w-0">
        <PageHeader eyebrow={sectionOf(page)} title={entry.label} lede={entry.summary} />
        <div className="mt-8">{children}</div>

        {(previous || next) && (
          <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-fx-line pt-6">
            {previous ? (
              <Link
                to="/manual/$page"
                params={{ page: previous.page }}
                className="inline-flex items-center gap-2 text-fx-small font-bold text-fx-ink2 hover:text-fx-emphasis"
              >
                <ArrowLeft aria-hidden className="size-4" />
                {previous.label}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to="/manual/$page"
                params={{ page: next.page }}
                className="inline-flex items-center gap-2 text-fx-small font-bold text-fx-ink2 hover:text-fx-emphasis"
              >
                {next.label}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
