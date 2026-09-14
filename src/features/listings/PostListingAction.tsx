import { Plus } from "lucide-react";
import type { User } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/Button";

// Whoever is looking, the marketplace asks for a listing — the next step differs.
export function PostListingAction({ me }: { me: User | undefined }) {
  const icon = <Plus className="size-4" strokeWidth={2.6} />;

  if (!me) {
    return (
      <ButtonLink to="/register">
        {icon}
        Join to post a listing
      </ButtonLink>
    );
  }
  if (me.organizations.length === 0) {
    return (
      <ButtonLink to="/organizations/new">
        {icon}
        Add your organisation to post
      </ButtonLink>
    );
  }
  return (
    <ButtonLink to="/marketplace/new">
      {icon}
      Add a listing
    </ButtonLink>
  );
}
