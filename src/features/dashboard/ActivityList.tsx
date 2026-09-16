import type { ReactNode } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { timeAgo } from "@/lib/time";
import { Avatar } from "@/components/ui/Avatar";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { orgFeedQueryOptions, type FeedActivity } from "./api";

// The feed carries marketplace and event activity only (networks are for facilitators).
const ACTIONS: Record<string, string> = {
  listing_created: "posted a listing",
  event_created: "created an event",
};

const ROW = "flex items-center gap-3 py-3.5";

function ActivityRow({ activity }: { activity: FeedActivity }) {
  const { organization, owner, trackable } = activity;
  const who = organization?.name ?? owner.name;
  const content: ReactNode = (
    <>
      <Avatar name={who} src={organization ? null : owner.image_url} kind={organization ? "organization" : "person"} size="sm" />
      <p className="min-w-0 flex-1 truncate text-fx-small text-fx-ink2">
        <span className="font-bold text-fx-ink">{who}</span> {ACTIONS[activity.action] ?? activity.action}
        {trackable?.title && <> — {trackable.title}</>}
      </p>
      <time dateTime={activity.created_at} className="shrink-0 text-fx-small text-fx-muted">
        {timeAgo(activity.created_at)}
      </time>
    </>
  );

  return (
    <li className="border-t border-fx-line first:border-t-0">
      {trackable?.type === "listing" && trackable.id ? (
        <Link to="/marketplace/$id" params={{ id: trackable.id }} preload="intent" className={`${ROW} hover:text-fx-emphasis`}>
          {content}
        </Link>
      ) : trackable?.type === "event" ? (
        <Link to="/events" className={`${ROW} hover:text-fx-emphasis`}>
          {content}
        </Link>
      ) : (
        <div className={ROW}>{content}</div>
      )}
    </li>
  );
}

// "Around you": what the organisation and the networks it belongs to post.
export function ActivityList({ organizationId }: { organizationId: string }) {
  const query = useInfiniteQuery(orgFeedQueryOptions(organizationId));
  const activities = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-fx-heading text-fx-ink">Around you</h2>
      {query.isPending ? (
        <p className="mt-3 text-fx-small text-fx-muted">Loading…</p>
      ) : query.isError ? (
        <Banner tone="danger" className="mt-3">
          The activity could not be loaded. Try again in a moment.
        </Banner>
      ) : activities.length === 0 ? (
        <p className="mt-3 text-fx-body text-fx-ink2">Nothing yet. Listings and events from your organisation and its networks show up here.</p>
      ) : (
        <ul className="mt-1">
          {activities.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </ul>
      )}
      {query.hasNextPage && (
        <Button variant="ghost" size="sm" className="mt-2" disabled={query.isFetchingNextPage} onClick={() => query.fetchNextPage()}>
          {query.isFetchingNextPage ? "Loading…" : "Show more"}
        </Button>
      )}
    </Card>
  );
}
