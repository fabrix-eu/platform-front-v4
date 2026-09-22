import { useEffect, useRef, type ReactNode } from "react";
import type { MeOrganization } from "@/lib/auth";
import { Field } from "@/components/Field";
import { FormError, type AnyMutation } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { Button } from "@/components/ui/Button";
import type { Direction } from "../directions";
import type { Listing, ListingPayload } from "../types";
import { ListingShapeFields } from "./ListingShapeFields";
import { ListingTypeFields } from "./ListingTypeFields";

interface ListingFormProps {
  mutation: AnyMutation;
  /** Edit: the listing to pre-fill. Create: undefined. */
  listing?: Listing;
  organizations: MeOrganization[];
  defaultOrganizationId?: string;
  defaultType?: string;
  /** Fixed by the caller — hides the offered/wanted question. See ListingShapeFields. */
  direction?: Direction;
  /** The photos field — its uploads work differently on create and on edit. */
  images: ReactNode;
  busy?: boolean;
  /** Set it to submit from outside the form: a dialog footer button with `form={id}`. */
  id?: string;
  /** The caller renders the actions itself (in that dialog footer). */
  hideActions?: boolean;
  submitLabel: string;
  onSubmit: (payload: ListingPayload) => void;
  onCancel: () => void;
}

const text = (fd: FormData, key: string): string | null => {
  const value = fd.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
};

// One form for create and edit: uncontrolled fields, read back from FormData.
export function ListingForm({
  mutation,
  listing,
  organizations,
  defaultOrganizationId,
  defaultType,
  direction,
  images,
  busy,
  id,
  hideActions,
  submitLabel,
  onSubmit,
  onCancel,
}: ListingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  // Only the first invalid field of a submit attempt is worth scrolling to.
  const scrolled = useRef(false);
  const failed = !!mutation.error;

  // The form scrolls inside a dialog: an error the reader cannot see reads as
  // "nothing happened", so bring it into view.
  useEffect(() => {
    if (!failed) return;
    const first = formRef.current?.querySelector('[role="alert"], .text-fx-rose');
    (first ?? formRef.current)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [failed]);

  return (
    <form
      id={id}
      ref={formRef}
      className="space-y-7"
      // The browser focuses the first field it refuses, but does not scroll the
      // dialog to it — so its message would pop up out of sight.
      onInvalidCapture={(e) => {
        if (scrolled.current) return;
        scrolled.current = true;
        (e.target as HTMLElement).scrollIntoView({ block: "center" });
        window.setTimeout(() => {
          scrolled.current = false;
        }, 0);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit({
          organization_id: text(fd, "organization_id") ?? undefined,
          listing_type: text(fd, "listing_type") ?? "",
          direction: text(fd, "direction") ?? "offering",
          // An unchecked box sends nothing at all, which is the "no" it means.
          one_off: fd.get("one_off") != null,
          category: text(fd, "category") ?? "",
          subcategory: text(fd, "subcategory"),
          title: text(fd, "title") ?? "",
          description: text(fd, "description") ?? "",
          quantity: text(fd, "quantity"),
          expires_at: text(fd, "expires_at"),
          status: text(fd, "status") ?? undefined,
        });
      }}
    >
      <FormError mutation={mutation} />

      {!listing &&
        (organizations.length > 1 ? (
          <SelectField
            label="Posted by"
            name="organization_id"
            defaultValue={defaultOrganizationId}
            options={organizations.map((o) => ({ value: o.organization_id, label: o.organization_name }))}
            mutation={mutation}
          />
        ) : (
          <input type="hidden" name="organization_id" value={defaultOrganizationId} />
        ))}

      <ListingShapeFields listing={listing} direction={direction} />

      <ListingTypeFields
        mutation={mutation}
        initialType={listing?.listing_type ?? defaultType}
        initialCategory={listing?.category}
        initialSubcategory={listing?.subcategory}
      />

      <Field label="Title" name="title" required defaultValue={listing?.title} placeholder="e.g. Organic cotton roll-ends — 500 kg a month" mutation={mutation} />
      <TextareaField
        label="Description"
        name="description"
        required
        rows={6}
        defaultValue={listing?.description}
        placeholder="What it is, its condition, how and where it can be collected or delivered…"
        mutation={mutation}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Quantity" name="quantity" defaultValue={listing?.quantity} placeholder="e.g. 500 kg per month" mutation={mutation} />
        <Field label="Available until" name="expires_at" type="date" defaultValue={listing?.expires_at?.slice(0, 10)} mutation={mutation} />
      </div>

      {listing && (
        <SelectField
          label="Status"
          name="status"
          defaultValue={listing.status}
          options={[
            { value: "active", label: "Active — shown in the marketplace" },
            { value: "closed", label: "Closed — hidden from the marketplace" },
          ]}
          mutation={mutation}
        />
      )}

      {images}

      {!hideActions && (
        <div className="flex flex-wrap gap-3 border-t border-fx-line pt-6">
          <Button type="submit" disabled={mutation.isPending || busy}>
            {mutation.isPending || busy ? "Saving…" : submitLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
