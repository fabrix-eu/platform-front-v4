import { Crown, Eye, UserCog, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

const ROLES: { name: string; icon: LucideIcon; can: string[]; soon?: boolean }[] = [
  { name: "Owner", icon: Crown, can: ["Everything a Manager can do", "Invite and remove team members", "Delete the organisation"] },
  { name: "Manager", icon: UserCog, can: ["Edit the profile and data", "Post and manage listings", "Run the Compass", "Manage connections"] },
  { name: "Team", icon: Eye, can: ["View the profile and data", "Search the Directory", "Read messages", "No editing"], soon: true },
];

export function RolesPanel() {
  return (
    <section aria-labelledby="roles-title">
      <Eyebrow id="roles-title">What each role can do</Eyebrow>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        {ROLES.map(({ name, icon: Icon, can, soon }) => (
          <Card key={name}>
            <p className="flex items-center gap-2 text-fx-heading text-fx-ink">
              <Icon aria-hidden className="size-5 text-fx-emphasis" />
              {name}
              {soon && <span className="text-fx-small font-normal text-fx-muted">· coming soon</span>}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-fx-body text-fx-ink2 marker:text-fx-line2">
              {can.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
