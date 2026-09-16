import { useSuspenseQuery } from "@tanstack/react-query";
import { useCurrentOrg } from "@/lib/activeOrg";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { conversationsQueryOptions } from "./api";
import { ConversationList } from "./ConversationList";
import { ConversationThread } from "./ConversationThread";
import { belongsToOrg } from "./identity";

interface MessagesPageProps {
  /** The open conversation, from the URL. */
  selectedId?: string;
  onSelect: (id?: string) => void;
}

/**
 * One page for both mailboxes: under `/$orgSlug/messages` it keeps the conversations
 * that organisation is a side of and answers in its name, under `/messages` it shows
 * everything I am part of and answers as me.
 */
export function MessagesPage({ selectedId, onSelect }: MessagesPageProps) {
  const { me, orgSlug, currentOrg } = useCurrentOrg();
  const orgId = orgSlug ? currentOrg?.organization_id : undefined;

  const { data: all } = useSuspenseQuery(conversationsQueryOptions);
  const conversations = orgId ? all.filter((conversation) => belongsToOrg(conversation, orgId)) : all;
  const selected = conversations.find((conversation) => conversation.id === selectedId);

  return (
    <>
      <PageHeader
        eyebrow={orgId ? currentOrg?.organization_name : undefined}
        title="Messages"
        lede={orgId ? "Conversations your organisation is part of." : "Your conversations with other members."}
      />

      {conversations.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No messages yet"
          description="Conversations start from an organisation's profile or a marketplace listing — reach out to the partners you want to work with."
          action={<ButtonLink to="/marketplace">Browse the marketplace</ButtonLink>}
        />
      ) : (
        <div className="mt-8 grid gap-4 md:h-[calc(100vh-17rem)] md:min-h-[28rem] md:grid-cols-[19rem_1fr]">
          <div
            className={cn(
              "overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper md:overflow-y-auto",
              selected && "hidden md:block",
            )}
          >
            <ConversationList conversations={conversations} selectedId={selected?.id} me={me} orgId={orgId} onSelect={onSelect} />
          </div>

          <div
            className={cn(
              "flex min-h-0 flex-col rounded-fx-lg border border-fx-line bg-fx-paper",
              !selected && "hidden md:flex",
            )}
          >
            {selected ? (
              <ConversationThread key={selected.id} id={selected.id} me={me} orgId={orgId} onBack={() => onSelect(undefined)} />
            ) : (
              <p className="m-auto p-6 text-center text-fx-small text-fx-muted">Pick a conversation to read it.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
