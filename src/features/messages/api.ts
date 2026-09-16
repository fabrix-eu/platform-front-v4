import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Conversation, ConversationDetail, Message } from "./types";

/** Prefix shared by the list and every thread, to refresh them together. */
export const CONVERSATIONS_KEY = ["conversations"];

export interface NewConversation {
  recipient_organization_id: string;
  /** Write on behalf of one of my organisations; omitted = as myself. */
  initiator_organization_id?: string;
  content: string;
}

// POST /conversations creates the conversation and its first message in one call.
// The API refuses unclaimed organisations ("Can only message claimed organizations").
export function startConversation({ content, ...conversation }: NewConversation): Promise<{ id: string }> {
  return api.post<{ id: string }>("/conversations", { conversation, message: { content } });
}

// GET /conversations → every conversation I am part of, as myself or through one of my
// organisations, most recent first. There is no per-organisation endpoint: a mailbox
// bound to an organisation filters this list on the side that organisation is on.
export const conversationsQueryOptions = queryOptions({
  queryKey: [...CONVERSATIONS_KEY, "list"],
  queryFn: () => api.get<Conversation[]>("/conversations"),
});

export const conversationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [...CONVERSATIONS_KEY, id],
    queryFn: () => api.get<ConversationDetail>(`/conversations/${id}`),
  });

export interface NewMessage {
  conversationId: string;
  content: string;
  /** Reply in the name of this organisation — it must be a participant. */
  author_organization_id?: string;
}

export function sendMessage({ conversationId, ...message }: NewMessage): Promise<Message> {
  return api.post<Message>(`/conversations/${conversationId}/messages`, { message });
}

export function markConversationRead(id: string): Promise<{ success: boolean }> {
  return api.patch<{ success: boolean }>(`/conversations/${id}/read`);
}
