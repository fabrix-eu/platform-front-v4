import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { FormError } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { orgKindLabel } from "@/features/organizations/kinds";
import { createRelation, RELATION_TYPES } from "@/features/organizations/relations";
import type { OrganizationProfile, OrganizationSummary } from "@/features/organizations/types";
import { OrgSearchStep } from "@/features/organizations/wizard/OrgSearchStep";

const TYPE_OPTIONS = RELATION_TYPES.map((t) => ({ value: t.value, label: t.label }));

const FORM_ID = "add-connection-form";

/** Search the organisation you work with, then say how — a relation both sides can see. */
export function AddConnectionDialog({ org }: { org: OrganizationProfile }) {
  // Ephemeral: the dialog, and which organisation is being connected (a two-step flow).
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<OrganizationSummary | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (payload: { relation_type: string; description?: string }) =>
      createRelation({ from_organization_id: org.id, to_organization_id: picked!.id, ...payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
      toast(`${picked?.name} added to your connections`);
      setOpen(false);
      setPicked(null);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setPicked(null);
          mutation.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" strokeWidth={2.6} />
          Add a connection
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Add a connection"
        description={picked ? `How do you work with ${picked.name}?` : "The organisations you work with — they may already be on FABRIX."}
        // Only the second step has an action bar: the search step is a list to pick from.
        footer={
          picked ? (
            <div className="flex flex-wrap justify-end gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              {/* Outside the form, so it stays in view: `form` connects it back. */}
              <Button type="submit" form={FORM_ID} disabled={mutation.isPending}>
                {mutation.isPending ? "Adding…" : "Add connection"}
              </Button>
            </div>
          ) : undefined
        }
      >
        {picked ? (
          <form
            id={FORM_ID}
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              mutation.mutate({
                relation_type: String(fd.get("relation_type") ?? ""),
                description: String(fd.get("description") ?? "").trim() || undefined,
              });
            }}
          >
            <FormError mutation={mutation} fields={["to_organization_id", "from_organization_id"]} />
            <div className="flex items-center gap-3 rounded-fx border border-fx-line bg-fx-panel p-3">
              <Avatar name={picked.name} src={picked.image_url} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-fx-body font-bold text-fx-ink">{picked.name}</span>
                <span className="block truncate text-fx-small text-fx-muted">{[orgKindLabel(picked.kind), picked.address].filter(Boolean).join(" · ")}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={() => setPicked(null)}>
                Change
              </Button>
            </div>
            <SelectField
              label="How do you work together?"
              name="relation_type"
              required
              placeholder="Choose a relation"
              options={TYPE_OPTIONS}
              mutation={mutation}
            />
            <TextareaField
              label="Anything to add?"
              name="description"
              hint="Optional — what you exchange, or since when. Both organisations can see it."
              mutation={mutation}
            />
          </form>
        ) : (
          <OrgSearchStep
            onPick={setPicked}
            onCreate={() => setOpen(false)}
            placeholder="The organisation you work with"
            footer={
              <p className="text-fx-small text-fx-muted">
                Not on FABRIX yet?{" "}
                <Link to="/organizations/new" className="font-bold text-fx-emphasis underline-offset-4 hover:underline">
                  Add it and invite them to claim it
                </Link>
                .
              </p>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
