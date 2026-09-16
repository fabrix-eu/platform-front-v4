import type { User } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { formatWhen, otherParty } from "./identity";
import type { Conversation } from "./types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  me: User;
  orgId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

/** The mailbox: who wrote, the last thing said, and when. */
export function ConversationList({ conversations, selectedId, me, orgId, onSelect, className }: ConversationListProps) {
  return (
    <ul className={cn("divide-y divide-fx-line", className)}>
      {conversations.map((conversation) => {
        const other = otherParty(conversation, me, orgId);
        const name = other?.name ?? "Unknown";
        const selected = conversation.id === selectedId;
        const unread = conversation.unread_count > 0;

        return (
          <li key={conversation.id}>
            <button
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                selected ? "bg-fx-emphasis-soft" : "hover:bg-fx-panel",
              )}
            >
              <Avatar name={name} kind={other?.type === "user" ? "person" : "organization"} size="sm" />

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={cn("truncate text-fx-small text-fx-ink", unread ? "font-bold" : "font-medium")}>{name}</span>
                  <span className="shrink-0 text-fx-label text-fx-muted">{formatWhen(conversation.last_message_at)}</span>
                </span>
                <span className="mt-0.5 flex items-center gap-2">
                  <span className={cn("line-clamp-1 flex-1 text-fx-small", unread ? "text-fx-ink2" : "text-fx-muted")}>
                    {conversation.last_message?.content ?? "No messages yet"}
                  </span>
                  {unread && (
                    <span
                      className="flex size-5 shrink-0 items-center justify-center rounded-full bg-fx-emphasis text-[11px] font-bold text-fx-emphasis-ink"
                      aria-label={`${conversation.unread_count} unread`}
                    >
                      {conversation.unread_count}
                    </span>
                  )}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
