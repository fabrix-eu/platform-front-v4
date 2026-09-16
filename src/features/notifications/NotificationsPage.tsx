import { useInfiniteQuery, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { meQueryOptions } from "@/lib/auth";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pill } from "@/components/ui/Pill";
import { UNREAD_KEY } from "@/components/shell/useUnreadCounts";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { markAllNotificationsRead, markNotificationRead, notificationsQueryOptions, NOTIFICATIONS_KEY } from "./api";
import { NotificationRow } from "./NotificationRow";

export type NotificationFilter = "all" | "unread";

interface NotificationsPageProps {
  filter: NotificationFilter;
  onFilterChange: (filter: NotificationFilter) => void;
}

export function NotificationsPage({ filter, onFilterChange }: NotificationsPageProps) {
  const { data: me } = useSuspenseQuery(meQueryOptions);
  const queryClient = useQueryClient();
  const query = useInfiniteQuery(notificationsQueryOptions);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    queryClient.invalidateQueries({ queryKey: UNREAD_KEY });
  };
  const readOne = useMutation({ mutationFn: markNotificationRead, onSuccess: refresh });
  const readAll = useMutation({ mutationFn: markAllNotificationsRead, onSuccess: refresh });

  const all = query.data?.pages.flat() ?? [];
  // The index has no unread filter, so "Unread" narrows what is already loaded.
  const notifications = filter === "unread" ? all.filter((notification) => !notification.read) : all;
  const unreadLoaded = all.some((notification) => !notification.read);

  return (
    <>
      <PageHeader
        title="Notifications"
        lede="What happened on your organisations, listings and events."
        actions={
          unreadLoaded ? (
            <Button variant="ghost" disabled={readAll.isPending} onClick={() => readAll.mutate()}>
              {readAll.isPending ? "Marking…" : "Mark all as read"}
            </Button>
          ) : undefined
        }
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <Pill role="radio" aria-checked={filter === "all"} selected={filter === "all"} onClick={() => onFilterChange("all")}>
          All
        </Pill>
        <Pill role="radio" aria-checked={filter === "unread"} selected={filter === "unread"} onClick={() => onFilterChange("unread")}>
          Unread
        </Pill>
      </div>

      {query.isError ? (
        <Banner tone="danger" className="mt-6">
          Your notifications could not be loaded. Try again in a moment.
        </Banner>
      ) : query.isPending ? (
        <p className="mt-6 text-fx-small text-fx-muted">Loading…</p>
      ) : notifications.length === 0 ? (
        <EmptyState
          className="mt-6"
          title={filter === "unread" ? "Nothing unread" : "No notifications yet"}
          description={
            filter === "unread"
              ? "Everything loaded so far has been read."
              : "Join requests, new members and events around you show up here."
          }
        />
      ) : (
        <>
          <ul className="mt-6 overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper">
            {notifications.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} me={me} onRead={(id) => readOne.mutate(id)} />
            ))}
          </ul>
          <InfiniteScrollSentinel
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={() => query.fetchNextPage()}
          />
        </>
      )}
    </>
  );
}
