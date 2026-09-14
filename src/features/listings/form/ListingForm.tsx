import type { ReactNode } from "react";
import type { MeOrganization } from "@/lib/auth";
import { Field } from "@/components/Field";
import { FormError, type AnyMutation } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { TextareaField } from "@/components/TextareaField";
import { Button } from "@/components/ui/Button";
import type { Listing, ListingPayload } from "../types";
import { ListingTypeFields } from "./ListingTypeFields";

interface ListingFormProps {
  mutation: AnyMutation;
  /** Edit: the listing to pre-fill. Create: undefined. */
  listing?: Listing;
  organizations: MeOrganization[];
  defaultOrganizationId?: string;
  defaultType?: string;
  /** The photos field — its uploads work differently on create and on edit. */
  images: ReactNode;
  busy?: boolean;
  submitLabel: string;
  onSubmit: (payload: ListingPayload) => void;
  onCancel: () => void;
}

const text = (fd: FormData, key: string): string | null => {
  const value = fd.get(key);
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
};

// One form for create and edit: uncontrolled fields, read back from FormData.
export function ListingForm({ mutation, listing, organizations, defaultOrganizationId, defaultType, images, busy, submitLabel, onSubmit, onCancel }: ListingFormProps) {
  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSubmit({
          organization_id: text(fd, "organization_id") ?? undefined,
          listing_type: text(fd, "listing_type") ?? "",
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

      <div className="flex flex-wrap gap-3 border-t border-fx-line pt-6">
        <Button type="submit" disabled={mutation.isPending || busy}>
          {mutation.isPending || busy ? "Saving…" : submitLabel}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
