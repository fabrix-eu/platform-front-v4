import { PillLink } from "@/components/ui/Pill";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CATEGORIES_BY_TYPE, categoryLabel, isListingType, LISTING_TYPE_META, LISTING_TYPES, subcategoryOptions } from "../taxonomy";
import type { MarketplaceSearch } from "../search";

// Activity → category → speciality, each level appearing once its parent is picked.
// Clicking the active pill clears it and everything under it.
export function TaxonomyFilter({ search }: { search: MarketplaceSearch }) {
  const { by_type, by_category, by_subcategory } = search;
  const subcategories = by_category ? subcategoryOptions(by_category) : [];

  return (
    <div className="space-y-5">
      <div>
        <Eyebrow className="mb-3">Activity</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {LISTING_TYPES.map((type) => (
            <PillLink
              key={type}
              to="/marketplace"
              search={(prev) => ({ ...prev, by_type: by_type === type ? undefined : type, by_category: undefined, by_subcategory: undefined })}
              active={by_type === type}
              tone={LISTING_TYPE_META[type].tone}
              resetScroll={false}
            >
              {LISTING_TYPE_META[type].label}
            </PillLink>
          ))}
        </div>
      </div>

      {isListingType(by_type) && (
        <div>
          <Eyebrow className="mb-3">Category</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES_BY_TYPE[by_type].map((category) => (
              <PillLink
                key={category}
                to="/marketplace"
                search={(prev) => ({ ...prev, by_category: by_category === category ? undefined : category, by_subcategory: undefined })}
                active={by_category === category}
                resetScroll={false}
              >
                {categoryLabel(category)}
              </PillLink>
            ))}
          </div>
        </div>
      )}

      {subcategories.length > 0 && (
        <div>
          <Eyebrow className="mb-3">Speciality</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <PillLink
                key={sub.value}
                to="/marketplace"
                search={(prev) => ({ ...prev, by_subcategory: by_subcategory === sub.value ? undefined : sub.value })}
                active={by_subcategory === sub.value}
                resetScroll={false}
              >
                {sub.label}
              </PillLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
