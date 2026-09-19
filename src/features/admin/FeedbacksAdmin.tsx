import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { BadgeTone } from "@/components/ui/Badge";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { SearchInput } from "@/components/ui/SearchInput";
import { adminFeedbacksQueryOptions } from "./api";
import { AdminTable, Column, SortableColumn, TD } from "./AdminTable";
import { Pagination } from "./Pagination";
import { adminFeedbackParams, type AdminSearch } from "./search";

const CATEGORIES = ["bug", "feature", "question"] as const;

const TONE: Record<string, BadgeTone> = { bug: "rose", feature: "green", question: "amber" };
const LABEL: Record<string, string> = { bug: "Bug", feature: "Feature", question: "Question" };

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/**
 * The screenshot itself, not a link to go and find out. The old panel offered "View
 * screenshot" and nothing else, which is why nobody ever looked at one.
 *
 * It falls back to a link if the image does not load: these URLs are built as
 * `S3_BUCKET_URL/key` and only resolve while the bucket allows public reads, so a
 * broken image here is a real signal rather than a rendering bug.
 */
function Screenshot({ url }: { url: string }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-fx-label font-bold text-fx-rose hover:underline">
        Screenshot did not load — open it directly
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit">
      <img
        src={url}
        alt="Screenshot attached to this feedback"
        loading="lazy"
        onError={() => setBroken(true)}
        className="max-h-40 rounded-fx-sm border border-fx-line2 object-cover transition hover:brightness-95"
      />
    </a>
  );
}

interface Props {
  search: AdminSearch;
  onChange: (patch: Partial<AdminSearch>) => void;
}

export function FeedbacksAdmin({ search, onChange }: Props) {
  const query = useQuery(adminFeedbacksQueryOptions(adminFeedbackParams(search)));
  const rows = query.data?.data ?? [];
  const meta = query.data?.meta;

  const typing = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(typing.current), []);

  const refine = (patch: Partial<AdminSearch>) => onChange({ ...patch, page: undefined });
  const sort = (sort_by: string, sort_direction: "asc" | "desc") => refine({ sort_by, sort_direction });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-fx-lg border border-fx-line bg-fx-paper p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <Eyebrow className="mb-2">Search</Eyebrow>
          <SearchInput
            defaultValue={search.q ?? ""}
            placeholder="Anything in the message…"
            aria-label="Search feedbacks"
            onChange={(event) => {
              const value = event.currentTarget.value.trim();
              clearTimeout(typing.current);
              typing.current = setTimeout(() => refine({ q: value || undefined }), 350);
            }}
          />
        </div>

        <div>
          <Eyebrow className="mb-2">Category</Eyebrow>
          <div className="flex flex-wrap gap-2">
            <Pill selected={!search.category} onClick={() => refine({ category: undefined })}>All</Pill>
            {CATEGORIES.map((category) => (
              <Pill
                key={category}
                tone={TONE[category]}
                selected={search.category === category}
                onClick={() => refine({ category: search.category === category ? undefined : category })}
              >
                {LABEL[category]}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {query.isError ? (
        <Banner tone="danger">The feedbacks could not be loaded. Try again in a moment.</Banner>
      ) : rows.length === 0 && !query.isPending ? (
        <EmptyState title="Nothing here" description="No feedback matches what you are looking for." />
      ) : (
        <>
          <AdminTable
            busy={query.isFetching}
            head={
              <>
                <SortableColumn label="Category" field="category" current={search.sort_by} direction={search.sort_direction} onSort={sort} />
                <Column label="What they said" />
                <Column label="Who" />
                <SortableColumn label="Sent" field="created_at" current={search.sort_by} direction={search.sort_direction} onSort={sort} align="right" />
              </>
            }
          >
            {rows.map((feedback) => (
              <tr key={feedback.id} className="border-t border-fx-line align-top">
                <td className={TD}>
                  <Badge tone={TONE[feedback.category] ?? "slate"}>{LABEL[feedback.category] ?? feedback.category}</Badge>
                </td>
                <td className={TD}>
                  <p className="max-w-xl whitespace-pre-line text-fx-ink2">{feedback.message}</p>
                  {feedback.screenshot_url && <Screenshot url={feedback.screenshot_url} />}
                </td>
                <td className={TD}>
                  <span className="block font-bold text-fx-ink">{feedback.user?.name ?? "—"}</span>
                  {feedback.user?.email && <span className="block text-fx-label text-fx-muted">{feedback.user.email}</span>}
                </td>
                <td className={`${TD} text-right whitespace-nowrap text-fx-muted`}>{shortDate(feedback.created_at)}</td>
              </tr>
            ))}
          </AdminTable>

          {meta && (
            <Pagination page={meta.current_page} totalPages={meta.total_pages} totalCount={meta.total_count} onChange={(page) => onChange({ page })} />
          )}
        </>
      )}
    </div>
  );
}
