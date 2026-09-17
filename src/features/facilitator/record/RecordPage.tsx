import { useSuspenseQuery } from "@tanstack/react-query";
import { networkOrganizationQueryOptions } from "./api";
import { BusinessDataCard } from "./BusinessDataCard";
import { InteractionsCard } from "./InteractionsCard";
import { NeedsCard } from "./NeedsCard";
import { NotesCard } from "./NotesCard";
import { PeopleCard } from "./PeopleCard";
import { RecordHeader } from "./RecordHeader";
import { RecordTasksCard } from "./RecordTasksCard";
import { SelfAssessmentCard } from "./SelfAssessmentCard";

/**
 * What a network knows about an organisation it follows — health, notes, needs,
 * figures, contacts and history. None of this is on the public profile, which
 * the header links to for the organisation's own side of the story.
 */
export function RecordPage({ networkSlug, recordId }: { networkSlug: string; recordId: string }) {
  const { data: record } = useSuspenseQuery(networkOrganizationQueryOptions(networkSlug, recordId));

  return (
    <>
      <RecordHeader networkSlug={networkSlug} record={record} />

      {/* Notes first: it is what a facilitator reaches for. */}
      <div className="mt-4">
        <NotesCard networkSlug={networkSlug} record={record} />
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <NeedsCard networkSlug={networkSlug} record={record} />
          <BusinessDataCard networkSlug={networkSlug} record={record} />
          <SelfAssessmentCard organizationId={record.organization.id} />
        </div>
        <div className="space-y-4">
          <PeopleCard networkSlug={networkSlug} recordId={record.id} />
          <RecordTasksCard networkSlug={networkSlug} recordId={record.id} />
          <InteractionsCard networkSlug={networkSlug} recordId={record.id} />
        </div>
      </div>
    </>
  );
}
