import { useEffect, useRef } from "react";

interface Props {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

/** Loads the next page when it scrolls into view (300px ahead). */
export function InfiniteScrollSentinel({ hasNextPage, isFetchingNextPage, fetchNextPage }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={ref} className="py-6 text-center text-fx-small text-fx-muted" aria-live="polite">
      {isFetchingNextPage ? "Loading more…" : null}
    </div>
  );
}
