import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import type { User } from "@/lib/auth";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { orgKindLabel } from "@/features/organizations/kinds";
import { deleteListing, LISTINGS_KEY } from "../api";
import type { Listing } from "../types";
import { ContactDialog } from "./ContactDialog";

function OwnerActions({ listing }: { listing: Listing }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LISTINGS_KEY });
      toast("Listing deleted");
      navigate({ to: "/marketplace" });
    },
  });

  return (
    <div className="grid gap-2">
      <ButtonLink to="/marketplace/$id/edit" params={{ id: listing.id }} variant="outline">
        <Pencil className="size-4" />
        Edit listing
      </ButtonLink>
      <Button
        variant="ghost"
        disabled={mutation.isPending}
        onClick={() => {
          if (window.confirm("Delete this listing? This cannot be undone.")) mutation.mutate(listing.id);
        }}
      >
        <Trash2 className="size-4" />
        {mutation.isPending ? "Deleting…" : "Delete"}
      </Button>
    </div>
  );
}

// Who posted it, and the one thing to do next: contact them, sign in to, or manage it.
export function ListingAside({ listing, me }: { listing: Listing; me: User | undefined }) {
  const org = listing.organization;
  const isOwner = !!me?.organizations.some((o) => o.organization_id === org.id);

  return (
    <aside className="space-y-4 lg:sticky lg:top-8">
      <Card>
        <Eyebrow>Posted by</Eyebrow>
        <Link to="/organizations/$id" params={{ id: org.slug || org.id }} className="group mt-4 flex items-center gap-3">
          <Avatar name={org.name} src={org.image_url} />
          <div className="min-w-0">
            <p className="truncate text-fx-body font-bold text-fx-ink group-hover:text-fx-emphasis">{org.name}</p>
            <p className="truncate text-fx-small text-fx-muted">{orgKindLabel(org.kind)}</p>
          </div>
        </Link>
        {org.address && (
          <p className="mt-4 flex items-start gap-2 text-fx-small text-fx-ink2">
            <MapPin aria-hidden className="mt-0.5 size-3.5 shrink-0 text-fx-muted" />
            {org.address}
          </p>
        )}
        <div className="mt-5 border-t border-fx-line pt-5">
          {isOwner ? (
            <OwnerActions listing={listing} />
          ) : me ? (
            <ContactDialog listing={listing} me={me} />
          ) : (
            <div className="grid gap-2">
              <ButtonLink to="/login">Sign in to contact them</ButtonLink>
              <ButtonLink to="/register" variant="ghost">
                New to FABRIX? Join
              </ButtonLink>
            </div>
          )}
        </div>
      </Card>
    </aside>
  );
}
