import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Handshake } from "lucide-react";
import type { User } from "@/lib/auth";
import { resolveCurrentOrg } from "@/lib/activeOrg";
import { labelClass } from "@/components/Field";
import { FieldError, FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { createRelation, deleteRelation, RELATION_TYPES, relationLabel, type NewRelation } from "../relations";
import type { OrganizationProfile } from "../types";

// Declaring how one of my organisations works with this one. It shows on both
// profiles and on the connections map.
export function ConnectDialog({ org, me }: { org: OrganizationProfile; me: User }) {
  // Ephemeral: whether the dialog is open.
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mine = new Map(me.organizations.map((o) => [o.organization_id, o.organization_name]));
  const existing = org.relations.filter(
    (r) => (mine.has(r.from_organization_id) && r.to_organization_id === org.id) || (mine.has(r.to_organization_id) && r.from_organization_id === org.id),
  );

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
  const create = useMutation({
    mutationFn: (relation: NewRelation) => createRelation(relation),
    meta: { silentErrors: true },
    onSuccess: () => {
      refresh();
      setOpen(false);
      toast(`Connected with ${org.name}`);
    },
  });
  const remove = useMutation({ mutationFn: deleteRelation, onSuccess: refresh });

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) create.reset(); }}>
      <DialogTrigger asChild>
        <Button variant={existing.length > 0 ? "outline" : "primary"}>
          {existing.length > 0 ? <Check className="size-4" /> : <Handshake className="size-4" />}
          {existing.length > 0 ? "Connected" : "Connect"}
        </Button>
      </DialogTrigger>
      <DialogContent title={`Connect with ${org.name}`} description="Say how you work together. It appears on both profiles and on the connections map.">
        {existing.length > 0 && (
          <ul className="mb-6 space-y-2">
            {existing.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 rounded-fx-sm bg-fx-panel px-3 py-2">
                <span className="min-w-0 truncate text-fx-small text-fx-ink2">
                  <span className="font-bold text-fx-ink">{relationLabel(r.relation_type)}</span> · {mine.get(r.from_organization_id) ?? mine.get(r.to_organization_id)}
                </span>
                <Button variant="ghost" size="sm" disabled={remove.isPending} onClick={() => window.confirm("Remove this connection?") && remove.mutate(r.id)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            create.mutate({
              from_organization_id: String(fd.get("from_organization_id")),
              to_organization_id: org.id,
              relation_type: String(fd.get("relation_type") ?? ""),
              description: String(fd.get("description") ?? "").trim() || undefined,
            });
          }}
        >
          <FormError mutation={create} fields={["relation_type", "description"]} />
          {me.organizations.length > 1 ? (
            <SelectField
              label="On behalf of"
              name="from_organization_id"
              defaultValue={resolveCurrentOrg(me)?.organization_id}
              options={me.organizations.map((o) => ({ value: o.organization_id, label: o.organization_name }))}
              mutation={create}
            />
          ) : (
            <input type="hidden" name="from_organization_id" value={me.organizations[0]?.organization_id} />
          )}
          <fieldset>
            <legend className={labelClass}>How you work together *</legend>
            <div className="space-y-2">
              {RELATION_TYPES.map((t) => (
                <label key={t.value} className="flex cursor-pointer items-start gap-3 rounded-fx border border-fx-line p-3 transition has-[:checked]:border-fx-emphasis has-[:checked]:bg-fx-emphasis-soft">
                  <input type="radio" name="relation_type" value={t.value} required className="mt-1 accent-fx-emphasis" />
                  <span>
                    <span className="block text-fx-body font-bold text-fx-ink">{t.label}</span>
                    <span className="block text-fx-small text-fx-muted">{t.description}</span>
                  </span>
                </label>
              ))}
            </div>
            <FieldError mutation={create} field="relation_type" />
          </fieldset>
          <TextareaField label="Details" name="description" rows={2} placeholder="e.g. We send them our cutting waste every month" mutation={create} />
          <div className="flex flex-wrap justify-end gap-3">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Connecting…" : "Connect"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
