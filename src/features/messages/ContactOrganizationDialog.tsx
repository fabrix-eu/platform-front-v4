import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import type { User } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { startConversation } from "./api";

interface ContactOrganizationDialogProps {
  organization: { id: string; name: string };
  me: User;
  /** Pre-filled message (e.g. which listing this is about). */
  greeting?: string;
  trigger: ReactNode;
}

/**
 * Starts a conversation with an organisation, **in the name of one of mine**. Writing
 * as a private person is gone: the ecosystem connects organisations, and a thread that
 * belongs to one is visible to the colleagues and outlives whoever opened it. The
 * person is never hidden — every message still carries its author.
 *
 * Only creation is org-only. Threads opened before this rule still show their human
 * side, and can still be answered, until the data migration converts them.
 */
export function ContactOrganizationDialog({ organization, me, greeting = "", trigger }: ContactOrganizationDialogProps) {
  // Ephemeral: whether the dialog is open.
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const mutation = useMutation({ mutationFn: startConversation, meta: { silentErrors: true } });

  const orgs = me.organizations;
  const sender = resolveCurrentOrg(me);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) mutation.reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {orgs.length === 0 ? (
        // The trigger stays: hiding it would leave no explanation for why you cannot write.
        <DialogContent title={`Message ${organization.name}`} description="Messages travel between organisations.">
          <p className="text-fx-body text-fx-ink2">
            On FABRIX an organisation writes to an organisation, so your message carries who you work for and
            your colleagues can follow it. Add yours — it takes a minute — and you can reach {organization.name}
            {" "}right after.
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <ButtonLink to="/organizations/new">Add my organisation</ButtonLink>
          </div>
        </DialogContent>
      ) : (
        <DialogContent title={`Message ${organization.name}`} description="They receive it in their FABRIX messages.">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mutation.mutate(
                {
                  recipient_organization_id: organization.id,
                  initiator_organization_id: String(fd.get("initiator_organization_id") ?? ""),
                  content: String(fd.get("content")).trim(),
                },
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

            {orgs.length === 1 ? (
              // One organisation is not a choice — it is a fact worth stating.
              <>
                <input type="hidden" name="initiator_organization_id" value={orgs[0].organization_id} />
                <p className="text-fx-small text-fx-ink2">
                  Sent as <span className="font-bold text-fx-ink">{orgs[0].organization_name}</span>, signed {me.name}.
                </p>
              </>
            ) : (
              <SelectField
                label="Send as"
                name="initiator_organization_id"
                required
                mutation={mutation}
                defaultValue={sender?.organization_id ?? orgs[0].organization_id}
                options={orgs.map((o) => ({ value: o.organization_id, label: o.organization_name }))}
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
      )}
    </Dialog>
  );
}
