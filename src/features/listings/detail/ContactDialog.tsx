import { MessageSquare } from "lucide-react";
import type { User } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { ContactOrganizationDialog } from "@/features/messages/ContactOrganizationDialog";
import { typeMeta } from "../taxonomy";
import type { Listing } from "../types";

export function ContactDialog({ listing, me }: { listing: Listing; me: User }) {
  return (
    <ContactOrganizationDialog
      organization={listing.organization}
      me={me}
      greeting={`Hi, I'm contacting you about your ${typeMeta(listing.listing_type).singular}: "${listing.title}"\n\n`}
      trigger={
        <Button className="w-full">
          <MessageSquare className="size-4" />
          Contact {listing.organization.name}
        </Button>
      }
    />
  );
}
