import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { meQueryOptions } from "@/lib/auth";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { RADIUS_OPTIONS } from "@/features/explore/location";
import { AddressField } from "@/features/organizations/wizard/AddressField";
import { networkKey, updateNetwork, type NetworkPatch } from "./api";
import type { Network } from "./types";

const number = (value: FormDataEntryValue | null): number | null => {
  const text = String(value ?? "").trim();
  return text === "" ? null : Number(text);
};

/** Everything `PATCH /networks/:slug` accepts, minus the slug — see the note below. */
export function SettingsTab({ network }: { network: Network }) {
  const { data: me } = useSuspenseQuery(meQueryOptions);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const save = useMutation({
    mutationFn: (patch: NetworkPatch) => updateNetwork(network.slug, patch),
    meta: { silentErrors: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkKey(network.slug) });
      // The sidebar lists networks from `me`, not from this query: without this,
      // a renamed network keeps its old name in the nav until the next reload.
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast("Network updated");
    },
  });

  return (
    <div className="mt-8 max-w-xl">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          save.mutate({
            name: String(fd.get("name") ?? "").trim(),
            description: String(fd.get("description") ?? "").trim() || null,
            organization_id: String(fd.get("organization_id") ?? "") || null,
            center_address: String(fd.get("center_address") ?? "").trim() || null,
            center_lat: number(fd.get("center_lat")),
            center_lon: number(fd.get("center_lon")),
            radius_km: number(fd.get("radius_km")),
          });
        }}
      >
        <FormError mutation={save} fields={["name", "description", "organization_id", "center_address", "radius_km"]} />

        <Card className="space-y-5 p-5">
          <Eyebrow>Identity</Eyebrow>
          <Field label="Name" name="name" required defaultValue={network.name} mutation={save} />
          <TextareaField
            label="Description"
            name="description"
            rows={3}
            defaultValue={network.description}
            placeholder="What this network covers, in a sentence."
            mutation={save}
          />
        </Card>

        <Card className="space-y-5 p-5">
          <Eyebrow>Linked organisation</Eyebrow>
          <SelectField
            label="Runs this network"
            name="organization_id"
            mutation={save}
            defaultValue={network.organization?.id ?? ""}
            placeholder="None"
            options={me.organizations.map((membership) => ({ value: membership.organization_id, label: membership.organization_name }))}
            hint="It is shown as the network's owner, and its colleagues are the people you can grant facilitator access to."
          />
        </Card>

        <Card className="space-y-5 p-5">
          <Eyebrow>Territory</Eyebrow>
          <p className="text-fx-small text-fx-ink2">
            The centre and radius frame the network on the map. They do not filter the list — the organisations
            you follow are the ones you added.
          </p>
          <AddressField
            mutation={save}
            label="Centre"
            required={false}
            hint="Search a city or an address — it becomes the middle of the circle."
            names={{ address: "center_address", lat: "center_lat", lon: "center_lon" }}
            initial={
              network.center_address && network.center_lat != null && network.center_lon != null
                ? { address: network.center_address, lat: network.center_lat, lon: network.center_lon }
                : undefined
            }
          />
          <SelectField
            label="Radius"
            name="radius_km"
            mutation={save}
            defaultValue={network.radius_km != null ? String(network.radius_km) : ""}
            placeholder="No radius"
            options={RADIUS_OPTIONS.map((km) => ({ value: String(km), label: `${km} km` }))}
          />
        </Card>

        <Banner tone="info">
          The network’s address (<code>{network.slug}</code>) is not editable here: changing it would break every
          link already shared — the sidebar’s, and anyone’s bookmarks.
        </Banner>

        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </div>
  );
}
