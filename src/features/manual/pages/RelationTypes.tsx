import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RELATION_TYPES } from "@/features/organizations/relations";
import { FactList, proseLink as link } from "../parts";

const RULES = [
  ["Direction", "A connection goes from the organisation that declared it to the other. Your list reads “you → them” for the ones you declared and “them → you” for the ones declared toward you. Direction records who said it; the type says what flows."],
  ["One per direction", "Between two organisations there is at most one connection in each direction. To change its type, remove it and declare it again. The other organisation may declare its own, so a pair can carry two."],
  ["Who may declare", "Any member of either organisation, from Connections or from the other's profile. There is no approval: it is live when declared."],
  ["Who may remove", "Any member of either organisation, from Connections or from the profile's Connected dialog. Removing does not tell the other side."],
  ["Details", "An optional note, public on both profiles: what you exchange, since when."],
  ["Unclaimed partners", "A connection can point at a profile nobody manages. It shows Not claimed yet on your list; when the profile is claimed, the connection is there for its team."],
  ["Where it shows", "On both public profiles, with the type and the note; in the Directory's connection count; on a facilitator's network graph when both organisations are followed."],
];

/** Reference: the six connection types, rendered from the module the dialogs use. */
export function RelationTypes() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        A connection is a typed, directed link between two organisations. There are {RELATION_TYPES.length}{" "}
        types; they are the vocabulary of the value chain's relationships, and the graph a facilitator
        reads.
      </p>

      <Eyebrow className="mt-10 mb-3">The types</Eyebrow>
      <ul className="flex flex-col rounded-fx-lg border border-fx-line bg-fx-paper px-5">
        {RELATION_TYPES.map((type) => (
          <li key={type.value} className="grid gap-x-4 gap-y-1 border-t border-fx-line py-4 first:border-t-0 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <span>
              <Badge tone="violet">{type.label}</Badge>
            </span>
            <span className="text-fx-body text-fx-ink2">{type.description}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-fx-label text-fx-muted">
        Rendered from the same list the Connect dialog offers, so this page cannot fall behind it.
      </p>

      <Eyebrow className="mt-12 mb-3">The rules</Eyebrow>
      <FactList rows={RULES} />

      <Banner tone="info" className="mt-10">
        How to declare one is in{" "}
        <Link to="/manual/$page" params={{ page: "add-a-partner" }} className={link}>
          Add a partner
        </Link>
        ; why connections are the way the network grows, in{" "}
        <Link to="/manual/$page" params={{ page: "how-the-network-grows" }} className={link}>
          How the network grows
        </Link>
        .
      </Banner>
    </div>
  );
}
