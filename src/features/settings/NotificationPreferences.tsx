import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Banner } from "@/components/ui/Banner";
import { Switch } from "@/components/ui/Toggles";
import {
  NOTIFICATION_TYPE_LABELS,
  PREFERENCES_KEY,
  preferencesQueryOptions,
  updatePreference,
  type NotificationPreference,
} from "./api";

const GRID = "grid grid-cols-[1fr_4rem_4rem_4rem] items-center gap-2 px-4";

export function NotificationPreferences() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery(preferencesQueryOptions);

  const save = useMutation({
    mutationFn: updatePreference,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PREFERENCES_KEY }),
  });

  if (isPending) return <p className="mt-6 text-fx-small text-fx-muted">Loading…</p>;
  if (isError) return <Banner tone="danger" className="mt-6">Your preferences could not be loaded.</Banner>;

  // Anything the product retired is listed by the API but not shown.
  const preferences = data.filter((preference) => preference.notification_type in NOTIFICATION_TYPE_LABELS);

  const toggle = (preference: NotificationPreference, field: "enabled" | "in_app" | "email") => {
    if (preference.mandatory) return;
    const { notification_type, enabled, in_app, email } = preference;
    save.mutate({ notification_type, enabled, in_app, email, [field]: !preference[field] });
  };

  return (
    <div className="mt-6 max-w-2xl">
      <p className="text-fx-body text-fx-ink2">
        Choose what reaches you. Requests that need an answer from you cannot be switched off.
      </p>

      <div className="mt-5 overflow-hidden rounded-fx-lg border border-fx-line bg-fx-paper">
        <div className={`${GRID} border-b border-fx-line bg-fx-panel py-3 font-fx-display text-fx-label text-fx-muted uppercase`}>
          <span>Notification</span>
          <span className="text-center">On</span>
          <span className="text-center">In app</span>
          <span className="text-center">Email</span>
        </div>

        {preferences.map((preference) => (
          <div key={preference.notification_type} className={`${GRID} border-b border-fx-line py-3 last:border-b-0`}>
            <span className="text-fx-small text-fx-ink2">
              {NOTIFICATION_TYPE_LABELS[preference.notification_type]}
              {preference.mandatory && <span className="ml-2 text-fx-label text-fx-muted">Always on</span>}
            </span>

            {(["enabled", "in_app", "email"] as const).map((field) => (
              <span key={field} className="flex justify-center">
                <Switch
                  label={<span className="sr-only">{`${NOTIFICATION_TYPE_LABELS[preference.notification_type]} — ${field}`}</span>}
                  checked={preference[field]}
                  // The two channels only mean something while the notification is on.
                  disabled={preference.mandatory || (field !== "enabled" && !preference.enabled)}
                  onChange={() => toggle(preference, field)}
                />
              </span>
            ))}
          </div>
        ))}
      </div>

      {save.isError && <Banner tone="danger" className="mt-4">That preference could not be saved.</Banner>}
    </div>
  );
}
