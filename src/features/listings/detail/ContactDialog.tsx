import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import type { User } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { startConversation } from "@/features/messages/api";
import { typeMeta } from "../taxonomy";
import type { Listing } from "../types";

export function ContactDialog({ listing, me }: { listing: Listing; me: User }) {
  // Ephemeral: whether the dialog is open.
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const mutation = useMutation({ mutationFn: startConversation, meta: { silentErrors: true } });
  const org = listing.organization;
  const defaultSender = resolveCurrentOrg(me)?.organization_id ?? "";
  const greeting = `Hi, I'm contacting you about your ${typeMeta(listing.listing_type).singular}: "${listing.title}"\n\n`;

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) mutation.reset(); }}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessageSquare className="size-4" />
          Contact {org.name}
        </Button>
      </DialogTrigger>
      <DialogContent title={`Message ${org.name}`} description="They receive it in their FABRIX messages.">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const sender = String(fd.get("initiator_organization_id") ?? "");
            mutation.mutate(
              { recipient_organization_id: org.id, initiator_organization_id: sender || undefined, content: String(fd.get("content")).trim() },
              {
                onSuccess: () => {
                  setOpen(false);
                  toast(`Message sent to ${org.name}`);
                },
              },
            );
          }}
        >
          <FormError mutation={mutation} />
          {me.organizations.length > 0 && (
            <SelectField
              label="Send as"
              name="initiator_organization_id"
              mutation={mutation}
              defaultValue={defaultSender}
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
