import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { useCurrentOrg } from "@/lib/activeOrg";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHeader } from "@/components/ui/PageHeader";
import { organizationProfileQueryOptions } from "@/features/organizations/api";
import { essentials } from "@/features/organizations/editor/completion";
import { ActivityList } from "./ActivityList";
import { PendingActionsBanner } from "./PendingActionsBanner";

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

// The signed-in home — built from the design system's "Home" screen. It is where the
// referral loop is asked for: adding a partner is the largest thing on the page.
export function DashboardPage() {
  const { orgSlug } = useParams({ from: "/_auth/$orgSlug/dashboard" });
  const { me } = useCurrentOrg();
  const { data: org } = useSuspenseQuery(organizationProfileQueryOptions(orgSlug));
  const items = essentials(org);
  const done = items.filter((i) => i.done).length;
  const connections = org.relations_count;

  return (
    <>
      <PageHeader
        eyebrow={org.name}
        title={`${greeting()}, ${me.name.split(" ")[0]}.`}
        lede="The organisations you already work with are the quickest way to grow your network: add them, and they are invited to join."
      />

      <div className="mt-8 space-y-4">
        <PendingActionsBanner />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card tone="emphasis" className="p-6 lg:col-span-2">
            <Eyebrow className="text-fx-emphasis-ink opacity-70">The loop</Eyebrow>
            <p className="mt-3 max-w-md font-fx-display text-fx-title">Add the partners you already work with.</p>
            <p className="mt-2 max-w-md text-fx-small opacity-85">
              Suppliers, clients, collectors. They appear on your profile straight away, and get invited to claim theirs.
            </p>
            <Link
              to="/organizations/new"
              className="mt-5 inline-flex items-center gap-2 rounded-fx-action bg-fx-emphasis-ink px-4 py-2.5 text-fx-small font-bold text-fx-emphasis hover:brightness-95"
            >
              <Plus aria-hidden className="size-4" strokeWidth={2.6} />
              Add a partner
            </Link>
          </Card>

          <Card className="flex flex-col p-6">
            <Eyebrow>Your network</Eyebrow>
            <p className="mt-3 font-fx-display text-fx-display text-fx-ink">{connections}</p>
            <p className="mt-1 text-fx-small text-fx-ink2">{connections === 1 ? "connection" : "connections"} on FABRIX</p>
            <div className="mt-auto pt-4">
              <Link
                to="/$orgSlug/profile"
                params={{ orgSlug }}
                className="flex items-center gap-1.5 border-t border-fx-line pt-4 text-fx-small font-bold text-fx-emphasis hover:underline"
              >
                {done === items.length ? "Your profile is complete" : `Your profile: ${done} of ${items.length} essentials`}
                <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={2.4} />
              </Link>
            </div>
          </Card>
        </div>

        <ActivityList organizationId={org.id} />
      </div>
    </>
  );
}
