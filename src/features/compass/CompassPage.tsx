import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useCurrentOrg } from "@/lib/activeOrg";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { compassFormsQueryOptions } from "./api";
import { CompassCard } from "./CompassCard";
import { averageScore, compassEntry, completedCount } from "./status";

export function CompassPage() {
  const { orgSlug } = useParams({ from: "/_auth/$orgSlug/assessments/" });
  const { me } = useCurrentOrg();
  const organizationId = me.organizations.find((o) => o.organization_slug === orgSlug)?.organization_id ?? "";
  const { data: forms } = useSuspenseQuery(compassFormsQueryOptions(organizationId));

  const entries = [...forms].sort((a, b) => a.position - b.position).map(compassEntry);
  const done = completedCount(entries);
  const average = averageScore(entries);

  return (
    <>
      <PageHeader
        eyebrow={me.organizations.find((o) => o.organization_slug === orgSlug)?.organization_name}
        title="Compass"
        lede="Where your organisation stands on circularity — and what to work on next. Your answers stay yours: only your own team sees them."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <Card className="p-6">
          <Eyebrow>Your progress</Eyebrow>
          <p className="mt-3 font-fx-display text-fx-display text-fx-ink">
            {done} <span className="text-fx-title text-fx-muted">/ {entries.length}</span>
          </p>
          <p className="mt-1 text-fx-small text-fx-ink2">
            {done === 0
              ? "No questionnaire finished yet. Each one takes a few minutes, and you can stop whenever you like."
              : done === entries.length
                ? "All of them are done. Come back whenever something changes."
                : "Keep going — an unfinished questionnaire keeps whatever you already answered."}
          </p>
        </Card>

        {average != null && (
          <Card className="flex flex-col justify-center p-6 sm:w-56">
            <Eyebrow>Average score</Eyebrow>
            <p className="mt-3 font-fx-display text-fx-display text-fx-ink">{average}</p>
            <p className="mt-1 text-fx-small text-fx-ink2">out of 100, on what you finished</p>
          </Card>
        )}
      </div>

      {entries.length === 0 ? (
        <Banner tone="info" className="mt-8">
          No questionnaire is available yet. They arrive with the FABRIX team.
        </Banner>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <CompassCard key={entry.form.id} entry={entry} orgSlug={orgSlug} />
          ))}
        </div>
      )}
    </>
  );
}
