import { Plus } from "lucide-react";
import type { User } from "@/lib/auth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { NewEventDialog } from "./NewEventDialog";

const icon = <Plus className="size-4" strokeWidth={2.6} />;

// Whoever is looking, the page asks for an event — the next step differs.
export function NewEventAction({ me }: { me: User | undefined }) {
  if (!me) {
    return (
      <ButtonLink to="/register">
        {icon}
        Join to add an event
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
    <NewEventDialog
      trigger={
        <Button>
          {icon}
          Add an event
        </Button>
      }
    />
  );
}
