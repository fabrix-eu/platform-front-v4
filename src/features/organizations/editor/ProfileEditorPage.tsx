import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams, useSearch } from "@tanstack/react-router";
import { Eye, PenLine, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TabLink, TabList } from "@/components/ui/Tabs";
import { organizationProfileQueryOptions } from "../api";
import { TeamTab } from "../team/TeamTab";
import { EditProfileTab } from "./EditProfileTab";
import { PublicViewTab } from "./PublicViewTab";

const TABS = [
  { key: "edit", label: "Edit profile", icon: PenLine },
  { key: "team", label: "Team", icon: Users },
  { key: "public", label: "Public view", icon: Eye },
] as const;

export function ProfileEditorPage() {
  const { orgSlug } = useParams({ from: "/_auth/$orgSlug/profile" });
  const { tab = "edit" } = useSearch({ from: "/_auth/$orgSlug/profile" });
  const { data: org } = useSuspenseQuery(organizationProfileQueryOptions(orgSlug));

  return (
    <>
      <PageHeader eyebrow={org.name} title="Profile" lede="Your organisation record: what people see, and who can act on your behalf." />
      <TabList label="Profile" className="mt-8">
        {TABS.map(({ key, label, icon: Icon }) => (
          <TabLink
            key={key}
            to="/$orgSlug/profile"
            params={{ orgSlug }}
            search={{ tab: key === "edit" ? undefined : key }}
            active={tab === key}
            resetScroll={false}
          >
            <span className="flex items-center gap-2">
              <Icon aria-hidden className="size-4" />
              {label}
            </span>
          </TabLink>
        ))}
      </TabList>
      <div className="mt-8">
        {tab === "edit" && <EditProfileTab org={org} orgSlug={orgSlug} />}
        {tab === "team" && <TeamTab org={org} />}
        {tab === "public" && <PublicViewTab org={org} orgSlug={orgSlug} />}
      </div>
    </>
  );
}
