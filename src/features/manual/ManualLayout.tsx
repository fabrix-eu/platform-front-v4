import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { entryFor, MANUAL, neighbours, sectionOf, type ManualEntry, type ManualPage } from "./contents";
import { isWritten } from "./pages/index";

const LINK = "block rounded-fx px-3 py-1.5 text-fx-small transition";

function ContentsLink({ entry, current }: { entry: ManualEntry; current?: ManualPage }) {
  const active = entry.page === current;
  return (
    <Link
      to="/manual/$page"
      params={{ page: entry.page }}
      title={isWritten(entry.page) ? undefined : "This chapter is on its way"}
      className={cn(
        LINK,
        active
          ? "bg-fx-emphasis font-bold text-fx-emphasis-ink"
          : isWritten(entry.page)
            ? "text-fx-ink2 hover:bg-fx-paper hover:text-fx-ink"
            : "text-fx-muted hover:bg-fx-paper hover:text-fx-ink2",
      )}
    >
      {entry.label}
    </Link>
  );
}

/** The contents beside the page. Long sections carry sub-headings, one per area. */
function Contents({ current }: { current?: ManualPage }) {
  return (
    <nav
      aria-label="Manual contents"
      className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:self-start lg:overflow-y-auto lg:pr-2"
    >
      <Link to="/manual" className={cn(LINK, "mb-6 font-bold", current ? "text-fx-ink2 hover:bg-fx-paper hover:text-fx-ink" : "bg-fx-emphasis text-fx-emphasis-ink")}>
        User manual
      </Link>
      <div className="flex flex-col gap-7">
        {MANUAL.map((section) => (
          <div key={section.title}>
            <p className="mb-2 font-fx-display text-fx-label text-fx-ink uppercase">{section.title}</p>
            <ul className="flex flex-col gap-0.5">
              {section.entries.map((entry, index) => {
                const newArea = entry.area && entry.area !== section.entries[index - 1]?.area;
                return (
                  <li key={entry.page}>
                    {newArea && <Eyebrow className={cn("mb-1 px-3 text-[0.65rem]", index > 0 && "mt-3")}>{entry.area}</Eyebrow>}
                    <ContentsLink entry={entry} current={current} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

function ReadOn({ page }: { page: ManualPage }) {
  const { previous, next } = neighbours(page);
  if (!previous && !next) return null;
  const linkClass = "inline-flex items-center gap-2 text-fx-small font-bold text-fx-ink2 hover:text-fx-emphasis";
  return (
    <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-fx-line pt-6">
      {previous ? (
        <Link to="/manual/$page" params={{ page: previous.page }} className={linkClass}>
          <ArrowLeft aria-hidden className="size-4" />
          {previous.label}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to="/manual/$page" params={{ page: next.page }} className={linkClass}>
          {next.label}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      )}
    </div>
  );
}

/** The manual's own frame: the contents beside the page, and a way to read on. Without a page, it frames the overview. */
export function ManualLayout({ page, children }: { page?: ManualPage; children: ReactNode }) {
  const entry = page ? entryFor(page) : undefined;

  return (
    <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <Contents current={page} />
      <div className="min-w-0">
        {page && entry ? (
          <PageHeader eyebrow={sectionOf(page)} title={entry.label} lede={entry.summary} />
        ) : (
          <PageHeader eyebrow="Resources" title="User manual" />
        )}
        <div className="mt-8">{children}</div>
        {page && <ReadOn page={page} />}
      </div>
    </div>
  );
}
