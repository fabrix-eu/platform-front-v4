import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/PageHeader";
import { TabLink, TabList } from "@/components/ui/Tabs";
import { networkQueryOptions } from "./api";
import { OrganisationsTab } from "./OrganisationsTab";
import { OverviewTab } from "./OverviewTab";
import { TasksTab } from "./TasksTab";
import { TeamTab } from "./TeamTab";
import { NETWORK_TABS, TAB_LABELS, type NetworkSearch, type NetworkTab } from "./search";

interface NetworkDashboardPageProps {
  networkSlug: string;
  tab: NetworkTab;
  q?: string;
  tasks: "open" | "done";
  onSearchChange: (next: Partial<NetworkSearch>) => void;
}

/** One network's dashboard: its features as tabs, like the organisation profile. */
export function NetworkDashboardPage({ networkSlug, tab, q, tasks, onSearchChange }: NetworkDashboardPageProps) {
  const { data: network } = useSuspenseQuery(networkQueryOptions(networkSlug));

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
            // `overview` is the default: it stays out of the URL.
            search={{ tab: key === "overview" ? undefined : key }}
            active={tab === key}
          >
            {TAB_LABELS[key]}
          </TabLink>
        ))}
      </TabList>

      {tab === "overview" && <OverviewTab network={network} />}
      {tab === "organisations" && <OrganisationsTab network={network} q={q} onSearch={(next) => onSearchChange({ q: next || undefined })} />}
      {tab === "tasks" && <TasksTab network={network} filter={tasks} onFilterChange={(next) => onSearchChange({ tasks: next })} />}
      {tab === "team" && <TeamTab network={network} />}
    </>
  );
}
