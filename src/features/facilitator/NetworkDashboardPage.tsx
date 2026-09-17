import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/PageHeader";
import { TabLink, TabList } from "@/components/ui/Tabs";
import { networkQueryOptions } from "./api";
import { OrganisationsTab } from "./OrganisationsTab";
import { OverviewTab } from "./OverviewTab";
import { SettingsTab } from "./SettingsTab";
import { TasksTab } from "./TasksTab";
import { TeamTab } from "./TeamTab";
import { NETWORK_TABS, TAB_LABELS, type NetworkSearch } from "./search";

interface NetworkDashboardPageProps {
  networkSlug: string;
  search: NetworkSearch;
  onSearchChange: (patch: Partial<NetworkSearch>) => void;
}

/** One network's dashboard: its features as tabs, like the organisation profile. */
export function NetworkDashboardPage({ networkSlug, search, onSearchChange }: NetworkDashboardPageProps) {
  const { data: network } = useSuspenseQuery(networkQueryOptions(networkSlug));
  const tab = search.tab ?? "overview";

  return (
    <>
      <PageHeader
        eyebrow={network.organization?.name ?? "Facilitator"}
        title={network.name}
        lede={`${network.organizations_count} organisation${network.organizations_count === 1 ? "" : "s"} followed`}
      />

      <TabList label={network.name} className="mt-8">
        {NETWORK_TABS.map((key) => (
          <TabLink
            key={key}
            to="/facilitator/$networkSlug"
            params={{ networkSlug }}
            // `overview` is the default: it stays out of the URL. Switching tabs
            // drops the other tab's filters rather than carrying them along.
            search={{ tab: key === "overview" ? undefined : key }}
            active={tab === key}
          >
            {TAB_LABELS[key]}
          </TabLink>
        ))}
      </TabList>

      {tab === "overview" && <OverviewTab network={network} />}
      {tab === "organisations" && <OrganisationsTab network={network} search={search} onChange={onSearchChange} />}
      {tab === "tasks" && <TasksTab network={network} filter={search.tasks ?? "open"} onFilterChange={(next) => onSearchChange({ tasks: next })} />}
      {tab === "team" && <TeamTab network={network} />}
      {tab === "settings" && <SettingsTab network={network} />}
    </>
  );
}
