import type { User } from "@/lib/auth";
import type { Conversation, Message, Party } from "./types";

const sides = (conversation: Conversation): Party[] =>
  [conversation.initiator, conversation.recipient].filter((party): party is Party => party != null);

/**
 * Is this side me? In an organisation's mailbox only that organisation counts, so a
 * conversation between two of my organisations reads correctly from either side.
 */
export function isMine(party: Party, me: User, orgId?: string): boolean {
  if (orgId) return party.type === "organization" && party.id === orgId;
  if (party.type === "user") return party.id === me.id;
  return me.organizations.some((membership) => membership.organization_id === party.id);
}

/** Who I am in this conversation — an organisation means I answer in its name. */
export function mySide(conversation: Conversation, me: User, orgId?: string): Party | null {
  return sides(conversation).find((party) => isMine(party, me, orgId)) ?? null;
}

/** Who I am talking to: the side that is not mine. */
export function otherParty(conversation: Conversation, me: User, orgId?: string): Party | null {
  const parties = sides(conversation);
  return parties.find((party) => !isMine(party, me, orgId)) ?? parties[0] ?? null;
}

/** An organisation's mailbox holds the conversations that organisation is a side of. */
export function belongsToOrg(conversation: Conversation, orgId: string): boolean {
  return sides(conversation).some((party) => party.type === "organization" && party.id === orgId);
}

export const wroteIt = (message: Message, me: User): boolean => message.author.user.id === me.id;

/** How a message signs itself: the person, and the organisation they spoke for. */
export function authorLabel(message: Message): string {
  const person = message.author.user.name ?? "Someone";
  return message.author.organization ? `${person} · ${message.author.organization.name}` : person;
}

/** Times today, dates before — a mailbox is read at a glance. */
export function formatWhen(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  const sameYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString("en-GB", sameYear ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" });
}

/** The full stamp, kept in the bubble's tooltip. */
export const formatExact = (iso: string): string =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
