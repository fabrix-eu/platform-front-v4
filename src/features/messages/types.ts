/** One side of a conversation: a person, or an organisation. */
export interface Party {
  type: "user" | "organization";
  id: string;
  name: string;
  slug?: string;
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  /** Who wrote it: always a person, on behalf of an organisation or not. */
  author: {
    user: { id: string | null; name: string | null };
    organization: { id: string; name: string; slug: string } | null;
  };
}

export interface Conversation {
  id: string;
  initiator_type: "user" | "organization";
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  initiator: Party;
  recipient: Party | null;
  /** Messages written by someone else since I last opened it. */
  unread_count: number;
  /** The list only (`view: :with_last_message`). */
  last_message?: Message | null;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}
