import { useSearch } from "@tanstack/react-router";
import { Bell, Compass, Home, MapPin, Plus, ShoppingBag } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NavLink } from "@/components/ui/NavLink";
import { TabLink, TabList } from "@/components/ui/Tabs";
import { Row } from "./Section";
import { capitalize, TABS } from "./search";

const NAV_ITEMS = [
  { key: "home", icon: Home },
  { key: "marketplace", icon: ShoppingBag, count: 3 },
  { key: "compass", icon: Compass },
  { key: "notifications", icon: Bell, count: 5, alert: true },
] as const;

export function CatalogSurfaces() {
  const { tab = "overview", nav = "marketplace" } = useSearch({ from: "/design" });

  return (
    <>
      <Row label="Avatar" source="components/ui/Avatar" hint="organisations are squares, people are circles · colour derived from the name">
        <Avatar name="Maasstad Textiles" size="lg" />
        <Avatar name="Rotterdam Recycling" />
        <Avatar name="Loop Remade" />
        <Avatar name="Julia Wester" kind="person" />
        <Avatar name="De Vezel" size="sm" />
      </Row>

      <Row label="NavLink" source="components/ui/NavLink" hint="the active entry is filled, not tinted — the router sets it on real routes">
        <nav aria-label="Demo navigation" className="w-64 rounded-fx-lg border border-fx-line bg-fx-paper p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to="/design"
              search={(prev) => ({ ...prev, nav: item.key })}
              active={nav === item.key}
              icon={item.icon}
              count={"count" in item ? item.count : undefined}
              alert={"alert" in item ? item.alert : undefined}
              resetScroll={false}
              replace
            >
              {capitalize(item.key)}
            </NavLink>
          ))}
        </nav>
      </Row>

      <Row label="Tabs" source="components/ui/Tabs" hint="tabs are links — the active one is ?tab= here, a path on real pages">
        <TabList label="Organisation sections" className="w-full">
          {TABS.map((t) => (
            <TabLink key={t} to="/design" search={(prev) => ({ ...prev, tab: t })} active={tab === t} resetScroll={false} replace>
              {capitalize(t)}
            </TabLink>
          ))}
        </TabList>
      </Row>

      <Row label="Card" source="components/ui/Card" hint="paper for content · emphasis for the one number that matters · soft for a call to action">
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <Card>
            <Badge tone="green">Materials</Badge>
            <h4 className="mt-3 text-fx-heading">Woven cotton roll-ends</h4>
            <p className="mt-2 text-fx-small text-fx-ink2">Regular surplus from our weaving line — natural and dyed cotton, by weight.</p>
            <div className="mt-4 flex items-center gap-2 border-t border-fx-line pt-4">
              <Avatar name="Maasstad Textiles" size="sm" />
              <span className="text-fx-small text-fx-ink2">Maasstad Textiles</span>
              <span className="ml-auto flex items-center gap-1 text-fx-small text-fx-muted">
                <MapPin className="size-3.5" /> Rotterdam
              </span>
            </div>
          </Card>
          <Card tone="emphasis">
            <Eyebrow className="text-fx-emphasis-ink opacity-75">This month</Eyebrow>
            <p className="mt-3 font-fx-display text-fx-display">47</p>
            <p className="mt-1 text-fx-small opacity-85">partners invited by members</p>
          </Card>
          <Card tone="soft">
            <Eyebrow>Get started</Eyebrow>
            <h4 className="mt-3 text-fx-heading">Add the partners you already work with</h4>
            <p className="mt-2 text-fx-small text-fx-ink2">They keep your profile honest, and they get invited to claim theirs.</p>
            <Button size="sm" className="mt-4">
              Add a partner
            </Button>
          </Card>
        </div>
      </Row>

      <Row label="Banner" source="components/ui/Banner" hint="danger is what FormError renders">
        <div className="grid w-full gap-3">
          <Banner tone="warning" label="Heads up" action={<Button size="sm">Complete it</Button>}>
            Complete your profile to appear in the directory filters.
          </Banner>
          <Banner tone="info" label="Read-only">
            Claim an organisation to connect, follow or post.
          </Banner>
          <Banner tone="success" label="Sent">
            Invitation sent to hello@loopremade.eu.
          </Banner>
          <Banner tone="danger">Invalid email or password</Banner>
        </div>
      </Row>

      <Row label="EmptyState" source="components/ui/EmptyState" hint="an empty list always says what to do next">
        <EmptyState
          title="Nothing here yet"
          description="No listings match those filters. Widen the radius, or be the first to post one."
          action={
            <Button>
              <Plus className="size-4" strokeWidth={2.6} />
              Add a listing
            </Button>
          }
        />
      </Row>
    </>
  );
}
