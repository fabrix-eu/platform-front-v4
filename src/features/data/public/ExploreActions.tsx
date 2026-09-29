import { ArrowRight } from "lucide-react";
import { canSeeCityData, type User } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/Button";

/**
 * The way into the data, which depends on who is looking: a visitor creates an account,
 * a facilitator or a viewer opens the map, a member of an organisation is told why the
 * map is not theirs (the registers name competitors) and pointed to the request form.
 */
export function ExploreActions({ me, size = "md" }: { me?: User; size?: "md" | "sm" }) {
  if (!me) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <ButtonLink to="/register" size={size}>
          Create an account to explore
          <ArrowRight aria-hidden className="size-4" strokeWidth={2.6} />
        </ButtonLink>
        <ButtonLink to="/login" variant="outline" size={size}>
          Sign in
        </ButtonLink>
      </div>
    );
  }
  if (canSeeCityData(me)) {
    return (
      <ButtonLink to="/data/map" size={size}>
        Open the map
        <ArrowRight aria-hidden className="size-4" strokeWidth={2.6} />
      </ButtonLink>
    );
  }
  return (
    <p className="max-w-prose text-fx-small text-fx-ink2">
      The map names individual businesses, so it is open to facilitators, researchers and administrators, not to the
      organisations of the chain. Your organisation account does not see it; you can still ask the team for a dataset below.
    </p>
  );
}
