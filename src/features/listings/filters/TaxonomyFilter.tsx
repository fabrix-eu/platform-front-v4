import { PillLink } from "@/components/ui/Pill";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CATEGORIES_BY_TYPE, categoryLabel, isListingType, LISTING_TYPE_META, LISTING_TYPES } from "../taxonomy";
import type { MarketplaceSearch } from "../search";

// Activity → category, the categories appearing once an activity is picked.
// Clicking the active pill clears it and everything under it. The "other"
// activity has no category to pick.
export function TaxonomyFilter({ search }: { search: MarketplaceSearch }) {
  const { by_type, by_category } = search;

  return (
    <div className="space-y-5">
      <div>
        <Eyebrow className="mb-3">Activity</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {LISTING_TYPES.map((type) => (
            <PillLink
              key={type}
              to="/marketplace"
              search={(prev) => ({ ...prev, by_type: by_type === type ? undefined : type, by_category: undefined })}
              active={by_type === type}
              tone={LISTING_TYPE_META[type].tone}
              resetScroll={false}
            >
              {LISTING_TYPE_META[type].label}
            </PillLink>
          ))}
        </div>
      </div>

      {isListingType(by_type) && by_type !== "other" && (
        <div>
          <Eyebrow className="mb-3">Category</Eyebrow>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES_BY_TYPE[by_type].map((category) => (
              <PillLink
                key={category}
                to="/marketplace"
                search={(prev) => ({ ...prev, by_category: by_category === category ? undefined : category })}
                active={by_category === category}
                resetScroll={false}
              >
                {categoryLabel(category)}
              </PillLink>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
