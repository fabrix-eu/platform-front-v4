import { useSearch } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { OrganizationProfile } from "../types";
import { editorSections, type SectionGroup } from "./completion";
import { CompletionCard } from "./CompletionCard";
import { SectionCard } from "./SectionCard";
import { IdentityForm } from "./sections/IdentityForm";
import { SizeReachForm } from "./sections/SizeReachForm";

const GROUPS: { key: SectionGroup; title: string; lede: string }[] = [
  { key: "required", title: "Required to go live", lede: "The six fields that put you on the map." },
  {
    key: "portrait",
    title: "Build your portrait — tune FABRIX to you",
    lede: "Complete your profile so others know how to work with you. The more each section holds, the sharper your matches and the more of the right people find you.",
  },
  { key: "optional", title: "Optional & private", lede: "For you, whenever you want it — not part of getting your profile complete." },
];

export function EditProfileTab({ org, orgSlug }: { org: OrganizationProfile; orgSlug: string }) {
  const { section: open } = useSearch({ from: "/_auth/$orgSlug/profile" });
  const sections = editorSections(org);
  const firstIncomplete = sections.find((s) => s.group === "required" && s.status !== "complete")?.key;

  return (
    <div className="space-y-10">
      <CompletionCard org={org} orgSlug={orgSlug} firstIncomplete={firstIncomplete} />
      <p className="text-fx-body text-fx-muted">Open a section to finish it off — most take a minute. Everything here shapes who the platform puts in front of you.</p>

      {GROUPS.map((group) => (
        <section key={group.key} aria-labelledby={`group-${group.key}`}>
          <Eyebrow id={`group-${group.key}`} className={cn(group.key === "required" && "text-fx-emphasis")}>
            {group.title}
          </Eyebrow>
          <p className="mt-2 max-w-3xl text-fx-body text-fx-ink2">{group.lede}</p>
          <div className="mt-4 space-y-3">
            {sections
              .filter((s) => s.group === group.key)
              .map((s) => (
                <SectionCard key={s.key} section={s} orgSlug={orgSlug} open={open === s.key}>
                  {s.key === "identity" ? <IdentityForm org={org} /> : s.key === "size-reach" ? <SizeReachForm org={org} /> : null}
                </SectionCard>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
