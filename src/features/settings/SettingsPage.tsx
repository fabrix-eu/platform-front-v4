import { useSuspenseQuery } from "@tanstack/react-query";
import { meQueryOptions } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pill } from "@/components/ui/Pill";
import { DangerZone } from "./DangerZone";
import { EmailForm } from "./EmailForm";
import { NotificationPreferences } from "./NotificationPreferences";
import { PasswordForm } from "./PasswordForm";
import { ProfileForm } from "./ProfileForm";

export type SettingsTab = "account" | "notifications";

const TABS: { key: SettingsTab; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "notifications", label: "Notifications" },
];

interface SettingsPageProps {
  tab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsPage({ tab, onTabChange }: SettingsPageProps) {
  const { data: me } = useSuspenseQuery(meQueryOptions);

  return (
    <>
      <PageHeader title="Settings" lede="Your account, your password and what FABRIX tells you about." />

      <div className="mt-6 flex flex-wrap gap-2" role="tablist">
        {TABS.map(({ key, label }) => (
          <Pill key={key} role="tab" aria-selected={tab === key} selected={tab === key} onClick={() => onTabChange(key)}>
            {label}
          </Pill>
        ))}
      </div>

      {tab === "notifications" ? (
        <NotificationPreferences />
      ) : (
        <div className="mt-8 space-y-10 divide-y divide-fx-line [&>section:not(:first-child)]:pt-10">
          <ProfileForm me={me} />
          <EmailForm me={me} />
          <PasswordForm />
          <DangerZone />
        </div>
      )}
    </>
  );
}
