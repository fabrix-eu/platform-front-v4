import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Banner } from "@/components/ui/Banner";
import { UNREAD_KEY } from "@/components/shell/useUnreadCounts";
import { CONVERSATIONS_KEY, conversationQueryOptions, markConversationRead } from "./api";
import { authorLabel, formatExact, formatWhen, mySide, otherParty, wroteIt } from "./identity";
import { MessageComposer } from "./MessageComposer";

interface ConversationThreadProps {
  id: string;
  me: User;
  orgId?: string;
  onBack: () => void;
}

export function ConversationThread({ id, me, orgId, onBack }: ConversationThreadProps) {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery(conversationQueryOptions(id));
  const scroller = useRef<HTMLDivElement>(null);
  const marking = useRef(false);

  // Having the thread open is reading it, every time — not just the first time it
  // opens. A reply that lands while you are looking at it must clear too, or the
  // badge stays lit over a message you have already read. The flag only guards
  // against firing twice for the same round trip; once it lands the refetch says
  // zero unread and this stops on its own.
  useEffect(() => {
    if (!data || data.unread_count === 0 || marking.current) return;
    marking.current = true;
    markConversationRead(data.id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
        queryClient.invalidateQueries({ queryKey: UNREAD_KEY });
      })
      // A read receipt that does not go through is not worth interrupting anyone for.
      .catch(() => {})
      .finally(() => {
        marking.current = false;
      });
  }, [data, queryClient]);

  const count = data?.messages.length ?? 0;
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count, id]);

  if (isPending) return <p className="p-6 text-fx-small text-fx-muted">Loading the conversation…</p>;
  if (isError || !data) return <Banner tone="danger" className="m-4">This conversation could not be loaded.</Banner>;

  const other = otherParty(data, me, orgId);
  const mine = mySide(data, me, orgId);
  const name = other?.name ?? "Unknown";

  return (
    <>
      <header className="flex shrink-0 items-center gap-3 border-b border-fx-line px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className="-ml-1 rounded-fx-action p-1.5 text-fx-ink2 hover:bg-fx-panel md:hidden"
        >
          <ArrowLeft aria-hidden className="size-5" />
        </button>
        <Avatar name={name} kind={other?.type === "user" ? "person" : "organization"} size="sm" />
        <div className="min-w-0">
          {other?.type === "organization" && other.slug ? (
            <Link
              to="/organizations/$id"
              params={{ id: other.slug }}
              preload="intent"
              className="block truncate text-fx-body font-bold text-fx-ink hover:text-fx-emphasis"
            >
              {name}
            </Link>
          ) : (
            <p className="truncate text-fx-body font-bold text-fx-ink">{name}</p>
          )}
          <p className="truncate text-fx-label text-fx-muted">
            {other?.type === "organization" ? "Organisation" : "Member"}
          </p>
        </div>
      </header>

      <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {data.messages.map((message) => {
          const outgoing = wroteIt(message, me);
          return (
            <div key={message.id} className={cn("flex", outgoing ? "justify-end" : "justify-start")}>
              <div className="max-w-[85%] sm:max-w-[75%]">
                {!outgoing && <p className="mb-1 text-fx-label text-fx-muted">{authorLabel(message)}</p>}
                <div
                  className={cn(
                    "rounded-fx-lg px-4 py-2.5 text-fx-body whitespace-pre-wrap",
                    outgoing ? "bg-fx-emphasis text-fx-emphasis-ink" : "bg-fx-panel text-fx-ink",
                  )}
                >
                  {message.content}
                </div>
                <p className={cn("mt-1 text-fx-label text-fx-muted", outgoing && "text-right")} title={formatExact(message.created_at)}>
                  {formatWhen(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <MessageComposer
        conversationId={data.id}
        authorOrganizationId={mine?.type === "organization" ? mine.id : undefined}
        replyingAs={mine?.type === "organization" ? mine.name : me.name}
      />
    </>
  );
}
