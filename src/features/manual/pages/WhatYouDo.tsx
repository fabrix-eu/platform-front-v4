import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import {
  CATEGORIES_BY_TYPE,
  categoryLabel,
  LISTING_TYPE_META,
  LISTING_TYPES,
  subcategoryOptions,
} from "@/features/listings/taxonomy";

/**
 * Rendered from the very modules the app imports — never from a copy. The manual
 * cannot describe a vocabulary the product no longer offers, the way /design cannot
 * drift from the tokens.
 */
export function WhatYouDo() {
  const categories = LISTING_TYPES.flatMap((type) => CATEGORIES_BY_TYPE[type]);
  const specialities = categories.reduce((total, category) => total + subcategoryOptions(category).length, 0);

  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        One vocabulary describes the whole value chain, and everything on FABRIX is filed with it: your
        organisation, the listings on the marketplace, and the filters people use to find either. It has
        three levels — a type, a category inside it, and a speciality inside that.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge tone="slate">{LISTING_TYPES.length} types</Badge>
        <Badge tone="slate">{categories.length} categories</Badge>
        <Badge tone="slate">{specialities} specialities</Badge>
      </div>

      <Banner tone="info" className="mt-8">
        Pick the categories you work in, then refine them into specialities. A type is only there to group
        them — you never pick a type on its own, and it is not part of what people search you by.
      </Banner>

      <div className="mt-12 flex flex-col gap-10">
        {LISTING_TYPES.map((type) => (
          <section key={type} aria-labelledby={`type-${type}`}>
            <div className="flex flex-wrap items-baseline gap-3 border-b border-fx-line pb-2">
              <h2 id={`type-${type}`} className="text-fx-title text-fx-ink">
                {LISTING_TYPE_META[type].label}
              </h2>
              <Badge tone={LISTING_TYPE_META[type].tone}>{CATEGORIES_BY_TYPE[type].length} categories</Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {CATEGORIES_BY_TYPE[type].map((category) => (
                <Card key={category} className="p-4">
                  <h3 className="text-fx-body font-bold text-fx-ink">{categoryLabel(category)}</h3>
                  <ul className="mt-2 flex flex-col gap-1">
                    {subcategoryOptions(category).map((speciality) => (
                      <li key={speciality.value} className="flex gap-2 text-fx-small text-fx-ink2">
                        <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-fx-line2" />
                        {speciality.label}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}
