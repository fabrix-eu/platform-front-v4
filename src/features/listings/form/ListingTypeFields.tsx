import { useState } from "react";
import { labelClass } from "@/components/Field";
import { FieldError, type AnyMutation } from "@/components/FieldError";
import { SelectField } from "@/components/SelectField";
import { Pill } from "@/components/ui/Pill";
import { categoryOptions, LISTING_TYPE_META, LISTING_TYPES, subcategoryOptions } from "../taxonomy";

interface ListingTypeFieldsProps {
  mutation: AnyMutation;
  initialType?: string;
  initialCategory?: string;
  initialSubcategory?: string | null;
}

// The one controlled corner of the form: each level's options depend on the level
// above, so type and category are mirrored in state. Their values still travel in
// FormData (hidden input, native selects) like every other field.
export function ListingTypeFields({ mutation, initialType = "", initialCategory = "", initialSubcategory }: ListingTypeFieldsProps) {
  const [type, setType] = useState(initialType);
  const [category, setCategory] = useState(initialCategory);
  const subcategories = subcategoryOptions(category);

  return (
    <>
      <div>
        <span className={labelClass}>What is it? *</span>
        <input type="hidden" name="listing_type" value={type} />
        <div role="radiogroup" aria-label="Activity" className="flex flex-wrap gap-2">
          {LISTING_TYPES.map((t) => (
            <Pill
              key={t}
              role="radio"
              aria-checked={type === t}
              selected={type === t}
              tone={LISTING_TYPE_META[t].tone}
              onClick={() => {
                setType(t);
                setCategory("");
              }}
            >
              {LISTING_TYPE_META[t].label}
            </Pill>
          ))}
        </div>
        <FieldError mutation={mutation} field="listing_type" />
      </div>

      {type && (
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            key={`category-${type}`}
            label="Category"
            name="category"
            required
            placeholder="Choose a category"
            defaultValue={category}
            options={categoryOptions(type)}
            onChange={setCategory}
            mutation={mutation}
          />
          {subcategories.length > 0 && (
            <SelectField
              key={`subcategory-${category}`}
              label="Speciality"
              name="subcategory"
              placeholder="General"
              defaultValue={category === initialCategory ? initialSubcategory : ""}
              options={subcategories}
              mutation={mutation}
            />
          )}
        </div>
      )}
    </>
  );
}
