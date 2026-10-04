import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Network as NetworkIcon } from "lucide-react";
import { ApiError } from "@/lib/api";
import type { UserNetwork } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { menuContentClass, menuItemClass, menuLabelClass } from "@/components/ui/menu";
import { networkKey } from "../api";
import { addNetworkOrganization } from "./api";

const errorMessage = (error: Error) =>
  error instanceof ApiError ? (Object.values(error.errors ?? {}).flat()[0] ?? error.message) : "Something went wrong. Please try again.";

// On a profile, for facilitators: follow this organisation in one of their networks.
export function AddToNetworkButton({ organizationId, networks }: { organizationId: string; networks: UserNetwork[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const add = useMutation({
    mutationFn: (network: UserNetwork) => addNetworkOrganization(network.slug, { organization_id: organizationId }),
    // "Already in this network" comes back as a 422 the global handler leaves to forms.
    meta: { silentErrors: true },
    onSuccess: (added, network) => {
      queryClient.invalidateQueries({ queryKey: networkKey(network.slug) });
      toast(`${added.record.organization.name} is in ${network.name}`);
    },
    onError: (error) => toast(errorMessage(error), "error"),
  });

  const [only] = networks;
  if (networks.length === 1 && only) {
    return (
      <Button variant="outline" disabled={add.isPending} onClick={() => add.mutate(only)}>
        <NetworkIcon className="size-4" />
        Add to {only.name}
      </Button>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" disabled={add.isPending}>
          <NetworkIcon className="size-4" />
          Add to a network
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" sideOffset={6} className={menuContentClass}>
          <DropdownMenu.Label className={menuLabelClass}>Your networks</DropdownMenu.Label>
          {networks.map((network) => (
            <DropdownMenu.Item key={network.id} className={menuItemClass} onSelect={() => add.mutate(network)}>
              {network.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
