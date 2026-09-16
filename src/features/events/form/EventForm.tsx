import { useState } from "react";
import { Field } from "@/components/Field";
import { FormError, type AnyMutation } from "@/components/FieldError";
import { TextareaField } from "@/components/TextareaField";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Toggles";
import { AddressField } from "@/features/organizations/wizard/AddressField";
import type { EventPayload, FabrixEvent } from "../types";

interface EventFormProps {
  mutation: AnyMutation;
  /** Edit: the event to pre-fill. Create: undefined. */
  event?: FabrixEvent;
  /** Set it to submit from outside the form: a dialog footer button with `form={id}`. */
  id?: string;
  /** The caller renders the actions itself (in that dialog footer). */
  hideActions?: boolean;
  submitLabel: string;
  onSubmit: (payload: EventPayload) => void;
  onCancel: () => void;
}

const text = (fd: FormData, key: string): string | null => {
  const value = fd.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
};

const number = (fd: FormData, key: string): number | null => {
  const value = text(fd, key);
  return value === null ? null : Number(value);
};

// One form for create and edit: uncontrolled fields read back from FormData. Only
// "online or not" is state — it decides which half of the form is asked for.
export function EventForm({ mutation, event, id, hideActions, submitLabel, onSubmit, onCancel }: EventFormProps) {
  const [online, setOnline] = useState(event?.online ?? false);

  return (
    <form
      id={id}
      className="space-y-7"
      onInvalidCapture={(e) => (e.target as HTMLElement).scrollIntoView({ block: "center" })}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit({
          title: text(fd, "title") ?? "",
          description: text(fd, "description"),
          happens_at: text(fd, "happens_at") ?? "",
          online,
          online_url: online ? text(fd, "online_url") : null,
          address: online ? null : text(fd, "address"),
          country_code: online ? null : text(fd, "country_code"),
          lon: online ? null : number(fd, "lon"),
          lat: online ? null : number(fd, "lat"),
        });
      }}
    >
      <FormError mutation={mutation} fields={["title", "happens_at", "online_url", "address", "lon", "lat"]} />

      <Field
        label="What is it?"
        name="title"
        required
        defaultValue={event?.title}
        placeholder="e.g. Repair café — bring your jeans"
        mutation={mutation}
      />

      <Field
        label="When?"
        name="happens_at"
        type="datetime-local"
        required
        defaultValue={event?.happens_at?.slice(0, 16)}
        mutation={mutation}
      />

      <TextareaField
        label="What happens there?"
        name="description"
        rows={5}
        defaultValue={event?.description ?? undefined}
        placeholder="Who it is for, what to bring, how to get in…"
        mutation={mutation}
      />

      <div className="space-y-5 border-t border-fx-line pt-6">
        <Switch name="online" defaultChecked={online} onChange={(e) => setOnline(e.currentTarget.checked)} label="This one happens online" />

        {online ? (
          <Field
            label="Where do people join?"
            name="online_url"
            type="url"
            required
            defaultValue={event?.online_url ?? undefined}
            placeholder="https://…"
            hint="The link is public: anyone who opens the event can see it."
            mutation={mutation}
          />
        ) : (
          <AddressField
            mutation={mutation}
            initial={
              event?.address
                ? { address: event.address, lat: event.lat, lon: event.lon, country_code: event.country_code ?? undefined }
                : undefined
            }
          />
        )}
      </div>

      {!hideActions && (
        <div className="flex flex-wrap gap-3 border-t border-fx-line pt-6">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving…" : submitLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
