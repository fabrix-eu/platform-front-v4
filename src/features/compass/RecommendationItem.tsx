import { BookOpen, Check } from "lucide-react";
import type { Recommendation } from "./types";

const isUrl = (value: string) => value.startsWith("http://") || value.startsWith("https://");

/**
 * One piece of advice, against the question it answers.
 *
 * `knowledge_link` is a URL on one question and the title of a Learning Hub piece on the
 * other thirty-two. A title is shown as a title: inventing a search URL for it would
 * dress a guess as a destination.
 */
export function RecommendationItem({ item }: { item: Recommendation }) {
  return (
    <li className="border-t border-fx-line pt-3 first:border-0 first:pt-0">
      <p className="flex gap-2 text-fx-small font-bold text-fx-ink">
        {item.strength && <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-fx-green" strokeWidth={3} />}
        {item.question}
      </p>
      <p className="mt-1 text-fx-small text-fx-ink2">{item.feedback}</p>

      {item.knowledge_link &&
        (isUrl(item.knowledge_link) ? (
          <a
            href={item.knowledge_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-fx-label font-bold text-fx-emphasis hover:underline"
          >
            <BookOpen aria-hidden className="size-3.5" />
            Learning resources
          </a>
        ) : (
          <p className="mt-2 flex items-start gap-1.5 text-fx-label text-fx-muted">
            <BookOpen aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {item.knowledge_link}
          </p>
        ))}
    </li>
  );
}
