import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MANUAL, sectionOf, type ManualPage } from "../contents";
import { isWritten } from "./index";

/** What a chapter shows before it is written: its promise, and where to read meanwhile. */
export function InProgress({ page }: { page: ManualPage }) {
  const title = sectionOf(page);
  const written = MANUAL.find((section) => section.title === title)?.entries.filter((entry) => isWritten(entry.page)) ?? [];

  return (
    <div className="max-w-3xl">
      <Banner tone="info" label="On its way">
        This chapter is planned and not written yet. Its place in the manual is decided, so you can already
        see what it will cover; the text arrives with a coming release.
      </Banner>

      {written.length > 0 && (
        <>
          <Eyebrow className="mt-10 mb-3">Meanwhile, in {title}</Eyebrow>
          <ul className="flex flex-col">
            {written.map((entry) => (
              <li key={entry.page} className="border-t border-fx-line py-3 first:border-t-0">
                <Link
                  to="/manual/$page"
                  params={{ page: entry.page }}
                  className="inline-flex items-center gap-2 text-fx-body font-bold text-fx-ink hover:text-fx-emphasis"
                >
                  {entry.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
                <p className="mt-0.5 text-fx-small text-fx-ink2">{entry.summary}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
