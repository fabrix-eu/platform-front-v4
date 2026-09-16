import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { EVENTS_KEY, updateEvent } from "../api";
import type { EventPayload, FabrixEvent } from "../types";
import { EventForm } from "./EventForm";

const FORM_ID = "edit-event-form";

/** Its creator (or a FABRIX admin) corrects it in place. */
export function EditEventDialog({ event, trigger }: { event: FabrixEvent; trigger: ReactNode }) {
  // Ephemeral: the dialog.
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({ mutationFn: (payload: EventPayload) => updateEvent(event.id, payload) });

  const close = () => {
    setOpen(false);
    mutation.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-2xl"
        title="Edit event"
        description={event.title}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            {/* Outside the form, so it stays in view: `form` connects it back. */}
            <Button type="submit" form={FORM_ID} disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        }
      >
        <EventForm
          id={FORM_ID}
          hideActions
          mutation={mutation}
          event={event}
          submitLabel="Save changes"
          onCancel={close}
          onSubmit={(payload) =>
            mutation.mutate(payload, {
              onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: EVENTS_KEY });
                toast("Changes saved");
                close();
              },
            })
          }
        />
      </DialogContent>
    </Dialog>
  );
}
