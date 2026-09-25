import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MANUAL } from "../contents";
import { isWritten } from "./index";

/**
 * The manual's front page: the four sections side by side, each with what it is
 * for and its chapters. The reader picks the kind of help they need, not a topic.
 */
export function Overview() {
  return (
    <div>
      <p className="max-w-3xl text-fx-lead text-fx-ink2">
        Four sections, for four kinds of need. Learning the platform for the first time, getting one thing
        done, checking a fact, or understanding why it works the way it does — start from the one that
        matches what you came for.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {MANUAL.map((section) => (
          <Card key={section.title} className="p-6">
            <h2 className="text-fx-title text-fx-ink">{section.title}</h2>
            <p className="mt-1.5 text-fx-small text-fx-ink2">{section.purpose}</p>
            <ul className="mt-5 flex flex-col">
              {section.entries.map((entry) => (
                <li key={entry.page} className="border-t border-fx-line py-2.5 first:border-t-0">
                  <Link
                    to="/manual/$page"
                    params={{ page: entry.page }}
                    className="text-fx-body font-bold text-fx-ink hover:text-fx-emphasis"
                  >
                    {entry.label}
                  </Link>
                  {!isWritten(entry.page) && (
                    <Eyebrow className="ml-2 inline text-fx-muted">soon</Eyebrow>
                  )}
                  <p className="mt-0.5 text-fx-small text-fx-ink2">{entry.summary}</p>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
