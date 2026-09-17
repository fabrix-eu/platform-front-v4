import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { orgPeopleQueryOptions } from "./api";

/** Who to call: the organisation's people who are on the platform. */
export function PeopleCard({ networkSlug, recordId }: { networkSlug: string; recordId: string }) {
  const query = useQuery(orgPeopleQueryOptions(networkSlug, recordId));
  const people = query.data ?? [];

  return (
    <Card className="p-5">
      <Eyebrow>People{people.length > 0 ? ` · ${people.length}` : ""}</Eyebrow>

      {query.isPending ? (
        <p className="mt-3 text-fx-small text-fx-muted">Loading…</p>
      ) : people.length === 0 ? (
        <p className="mt-3 text-fx-body text-fx-ink2">Nobody from this organisation is on FABRIX yet.</p>
      ) : (
        <ul className="mt-3">
          {people.map((person) => (
            <li key={person.id} className="flex items-center gap-3 border-t border-fx-line py-3 first:border-t-0">
              <Avatar name={person.user.name} src={person.user.image_url} kind="person" size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-fx-small font-bold text-fx-ink">{person.user.name}</span>
                <a
                  href={`mailto:${person.user.email}`}
                  className="block truncate text-fx-label text-fx-muted hover:text-fx-emphasis"
                >
                  {person.user.email}
                </a>
              </span>
              {person.role === "owner" && <Badge tone="slate">Owner</Badge>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
