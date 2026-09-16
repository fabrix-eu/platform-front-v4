import { useState, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { createEvent, EVENTS_KEY } from "../api";
import { EventForm } from "./EventForm";

const FORM_ID = "new-event-form";

/** Adding an event without leaving the page; it opens once it exists. */
export function NewEventDialog({ trigger }: { trigger: ReactNode }) {
  // Ephemeral: the dialog.
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mutation = useMutation({ mutationFn: createEvent });

  const close = () => {
    setOpen(false);
    mutation.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-2xl"
        title="Add an event"
        description="Everyone on FABRIX can see it, and say whether they are coming."
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            {/* Outside the form, so it stays in view: `form` connects it back. */}
            <Button type="submit" form={FORM_ID} disabled={mutation.isPending}>
              {mutation.isPending ? "Publishing…" : "Publish event"}
            </Button>
          </div>
        }
      >
        <EventForm
          id={FORM_ID}
          hideActions
          mutation={mutation}
          submitLabel="Publish event"
          onCancel={close}
          onSubmit={(payload) =>
            mutation.mutate(payload, {
              onSuccess: async (event) => {
                await queryClient.invalidateQueries({ queryKey: EVENTS_KEY });
                toast("Event published");
                close();
                navigate({ to: "/events/$eventId", params: { eventId: event.id } });
              },
            })
          }
        />
      </DialogContent>
    </Dialog>
  );
}
