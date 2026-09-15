import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import type { User } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { startConversation } from "./api";

interface ContactOrganizationDialogProps {
  organization: { id: string; name: string };
  me: User;
  /** Pre-filled message (e.g. which listing this is about). */
  greeting?: string;
  trigger: ReactNode;
}

// Starts a conversation with an organisation — as one of my organisations, or as myself.
// The API only accepts claimed organisations as recipients.
export function ContactOrganizationDialog({ organization, me, greeting = "", trigger }: ContactOrganizationDialogProps) {
  // Ephemeral: whether the dialog is open.
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const mutation = useMutation({ mutationFn: startConversation, meta: { silentErrors: true } });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) mutation.reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent title={`Message ${organization.name}`} description="They receive it in their FABRIX messages.">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const sender = String(fd.get("initiator_organization_id") ?? "");
            mutation.mutate(
              { recipient_organization_id: organization.id, initiator_organization_id: sender || undefined, content: String(fd.get("content")).trim() },
              {
                onSuccess: () => {
                  setOpen(false);
                  toast(`Message sent to ${organization.name}`);
                },
              },
            );
          }}
        >
          <FormError mutation={mutation} fields={["content"]} />
          {me.organizations.length > 0 && (
            <SelectField
              label="Send as"
              name="initiator_organization_id"
              mutation={mutation}
              defaultValue={resolveCurrentOrg(me)?.organization_id ?? ""}
              options={[
                ...me.organizations.map((o) => ({ value: o.organization_id, label: o.organization_name })),
                { value: "", label: `${me.name} (just me)` },
              ]}
            />
          )}
          <TextareaField label="Message" name="content" rows={6} required defaultValue={greeting} mutation={mutation} />
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
