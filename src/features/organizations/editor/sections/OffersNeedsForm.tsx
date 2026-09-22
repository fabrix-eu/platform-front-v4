import { Badge } from "@/components/ui/Badge";
import { useCurrentOrg } from "@/lib/activeOrg";
import type { OrganizationProfile } from "../../types";
import { ListingsGroup } from "./ListingsGroup";

// D · Offers & needs — both sides are Marketplace listings; what separates them is the
// listing's `direction` (the API filters on it with `by_direction`). Because each group
// owns one direction, the form they open does not ask which way round it is — only the
// marketplace's own form still does, where nothing has said it yet.
//
// The prototype's private needs, visibility levels and alerts have no model on the API:
// a need here is public, and the copy says so rather than promising otherwise.
export function OffersNeedsForm({ org }: { org: OrganizationProfile }) {
  const { me } = useCurrentOrg();

  return (
    <div className="space-y-7">
      <ListingsGroup
        organizationId={org.id}
        organizations={me.organizations}
        direction="offering"
        title="List your offers"
        description="What could you offer other organisations? Everything you can make or do, share, advise on, or sell. Tag each one so the right people find it."
        empty="No offers yet. Each one goes on the Marketplace as a listing — it takes two minutes."
        addLabel="Add an offer"
        aside={<Badge tone="slate">Only what you publish</Badge>}
      />

      <ListingsGroup
        organizationId={org.id}
        organizations={me.organizations}
        direction="needing"
        title="List your needs"
        description="Being short of something is not a weakness — it is the fastest way to be found by whoever has it. Say what you are looking for and let them come to you."
        empty="No needs yet. Saying what you are looking for is often what starts a conversation."
        addLabel="Add a need"
        aside={<Badge tone="slate">Only what you publish</Badge>}
      />
    </div>
  );
}
