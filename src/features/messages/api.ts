import { api } from "@/lib/api";

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
