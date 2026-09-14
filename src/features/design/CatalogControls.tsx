import { useSearch } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import { ApiError } from "@/lib/api";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Pill, PillLink } from "@/components/ui/Pill";
import { Badge } from "@/components/ui/Badge";
import { Checkbox, Switch } from "@/components/ui/Toggles";
import { SearchInput } from "@/components/ui/SearchInput";
import { Field } from "@/components/Field";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { Row } from "./Section";
import { capitalize, KINDS } from "./search";

// Stand-ins for a mutation, so the fields render idle and with a server error.
const IDLE = { error: null, isPending: false };
const INVALID = {
  error: new ApiError(422, { errors: { website: ["is not a valid URL"] } }),
  isPending: false,
};

export function CatalogControls() {
  const { kind = "everyone" } = useSearch({ from: "/design" });

  return (
    <>
      <Row label="Button" source="components/ui/Button" hint="primary is the emphasis colour · ButtonLink is the same look on a router link">
        <Button>
          <Plus className="size-4" strokeWidth={2.6} />
          Add a listing
        </Button>
        <Button variant="outline">Invite a partner</Button>
        <ButtonLink to="/register" variant="secondary">
          Create an account
          <ArrowUpRight className="size-4" strokeWidth={2.4} />
        </ButtonLink>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
        <Button size="sm">Small</Button>
        <Button disabled>Disabled</Button>
      </Row>

      <Row label="Pill" source="components/ui/Pill" hint="PillLink writes the filter to the URL — click one, watch ?kind= change">
        {KINDS.map((k) => (
          <PillLink key={k} to="/design" search={(prev) => ({ ...prev, kind: k })} active={kind === k} resetScroll={false} replace>
            {capitalize(k)}
          </PillLink>
        ))}
        <span className="mx-2 h-6 w-px bg-fx-line" />
        <Pill selected>Recycling</Pill>
        <Pill>Dyeing</Pill>
      </Row>

      <Row label="Badge" source="components/ui/Badge" hint="listing types and states — orange is the only solid one">
        <Badge tone="green">Materials</Badge>
        <Badge tone="amber">Capacities</Badge>
        <Badge tone="teal">Services</Badge>
        <Badge tone="rose">Products</Badge>
        <Badge tone="indigo">Distribution</Badge>
        <Badge tone="violet">Owner</Badge>
        <Badge tone="orange">Wanted</Badge>
        <Badge tone="slate">Draft</Badge>
      </Row>

      <Row label="Fields" source="components/Field · SelectField · TextareaField · ui/SearchInput" hint="uncontrolled, server errors under the field">
        <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Organisation name" name="demo-name" defaultValue="Maasstad Textiles" mutation={IDLE} />
          <SelectField
            label="Kind"
            name="demo-kind"
            defaultValue="producer"
            mutation={IDLE}
            options={[
              { value: "designer", label: "Designer" },
              { value: "producer", label: "Producer" },
              { value: "recycler", label: "Recycler" },
            ]}
          />
          <Field label="Website" name="website" defaultValue="maasstad" mutation={INVALID} />
          <div className="sm:col-span-2 lg:col-span-3">
            <SearchInput placeholder="What you need or offer" aria-label="Search listings" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <TextareaField label="Description" name="demo-description" rows={3} mutation={IDLE} placeholder="What you do, what you look for" />
          </div>
        </div>
      </Row>

      <Row label="Switch & Checkbox" source="components/ui/Toggles" hint="native checkboxes underneath — FormData reads them">
        <Switch label="Email me about new listings nearby" defaultChecked />
        <Switch label="Show my organisation on the map" />
        <Checkbox label="I have the authority to claim this profile" defaultChecked />
        <Checkbox label="Unchecked" />
      </Row>
    </>
  );
}
