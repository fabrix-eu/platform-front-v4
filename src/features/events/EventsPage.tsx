import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useOptionalMe } from "@/lib/useOptionalMe";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { InfiniteScrollSentinel } from "@/features/explore/InfiniteScrollSentinel";
import { geoParams, myOrgLocation, resolveLocation } from "@/features/explore/location";
import { eventsInfiniteQueryOptions, eventsMapQueryOptions } from "./api";
import { EventCard, EventGridSkeleton, EventRow } from "./EventCard";
import { EventsLocationFilter, EventsSearchBox, EventsViewToggle, WhenFilter } from "./EventsFilters";
import { EventsMap } from "./EventsMap";
import { NewEventAction } from "./form/NewEventAction";

export function EventsPage() {
  const search = useSearch({ from: "/_auth/events/" });
  const me = useOptionalMe();
  const mine = myOrgLocation(me);
  const location = resolveLocation(search, mine);
  const view = search.view ?? "cards";
  const onMap = view === "map";
  const when = search.when ?? "upcoming";

  const filters = {
    search: search.search,
    ...(when === "past" ? { past: true } : { upcoming: true }),
    ...geoParams(location, search.country),
  };

  // Page by page while scrolling a list; all of them at once on the map.
  const listQuery = useInfiniteQuery({ ...eventsInfiniteQueryOptions(filters), enabled: !onMap });
  const mapQuery = useQuery({ ...eventsMapQueryOptions(filters), enabled: onMap });

  const events = onMap ? (mapQuery.data?.data ?? []) : (listQuery.data?.pages.flatMap((page) => page.data) ?? []);
  const total = onMap ? mapQuery.data?.meta.total_count : listQuery.data?.pages[0]?.meta.total_count;
  const pending = onMap ? mapQuery.isPending : listQuery.isPending;
  const failed = onMap ? mapQuery.isError : listQuery.isError;
  const fetching = onMap ? mapQuery.isFetching : listQuery.isFetching;
  const filtered = !!(search.search || search.country || location.active);

  return (
    <>
      <PageHeader
        title="Events"
        lede="Workshops, fairs and meet-ups of the circular textile ecosystem — online and across Europe."
        actions={<NewEventAction me={me} />}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside aria-label="Filters" className="space-y-7">
          <EventsSearchBox key={search.search ?? ""} value={search.search} />
          <WhenFilter when={when} />
          <EventsLocationFilter search={search} location={location} hasMyLocation={mine !== null} />
        </aside>

        <section aria-label="Events" aria-busy={fetching}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-fx-small font-bold text-fx-ink2">
              {total === undefined ? "Loading…" : `${total} ${when === "past" ? "past " : ""}event${total === 1 ? "" : "s"}`}
              {location.active && (
                <span className="font-normal text-fx-muted">
                  {" "}
                  within {location.radius} km of {location.label}
                </span>
              )}
            </p>
            <EventsViewToggle view={view} />
          </div>

          {pending ? (
            onMap ? (
              <div className="h-[70vh] min-h-[420px] animate-pulse rounded-fx-lg bg-fx-panel" />
            ) : (
              <EventGridSkeleton />
            )
          ) : failed ? (
            <Banner tone="danger">The events could not be loaded. Try again in a moment.</Banner>
          ) : events.length === 0 ? (
            <EmptyState
              title={filtered ? "No event matches" : when === "past" ? "Nothing has happened yet" : "No event coming up"}
              description={
                filtered
                  ? "Widen the radius, remove a filter — or be the one who organises it."
                  : "Workshops, open days, repair cafés: be the first to put one on the map."
              }
              action={<NewEventAction me={me} />}
            />
          ) : onMap ? (
            <EventsMap events={events} location={location} />
          ) : view === "cards" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          )}

          {!onMap && (
            <InfiniteScrollSentinel
              hasNextPage={listQuery.hasNextPage}
              isFetchingNextPage={listQuery.isFetchingNextPage}
              fetchNextPage={listQuery.fetchNextPage}
            />
          )}
        </section>
      </div>
    </>
  );
}
