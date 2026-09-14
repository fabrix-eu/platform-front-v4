import { useCurrentOrg } from "@/lib/activeOrg";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";

// TEMPORARY — stands in for a page not rebuilt yet, so every sidebar entry lands
// somewhere on this site. Each route replaces it when its page ships; delete this
// file once none uses it (grep PagePlaceholder).
export function PagePlaceholder({ title, lede }: { title: string; lede: string }) {
  const { orgSlug, currentOrg } = useCurrentOrg();

  return (
    <>
      <PageHeader eyebrow={orgSlug ? currentOrg?.organization_name : undefined} title={title} lede={lede} />
      <EmptyState
        className="mt-10"
        title="Being rebuilt"
        description="This page is moving to the new platform. It will appear here as soon as it is ready."
      />
    </>
  );
}
