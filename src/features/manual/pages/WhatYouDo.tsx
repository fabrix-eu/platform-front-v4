import { Badge } from "@/components/ui/Badge";
import { Banner } from "@/components/ui/Banner";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { categoryLabel, CATEGORIES_BY_TYPE, LISTING_TYPE_META, LISTING_TYPES } from "@/features/listings/taxonomy";
import { SUPPORT_ROLES, VALUE_CHAIN_STAGES } from "@/features/organizations/position";

/**
 * Rendered from the very modules the app imports — never from a copy. The manual
 * cannot describe a vocabulary the product no longer offers, the way /design cannot
 * drift from the tokens.
 */
export function WhatYouDo() {
  return (
    <div className="max-w-3xl">
      <p className="text-fx-lead text-fx-ink2">
        Two vocabularies, one for each question. Where does your organisation sit in the value chain? And
        what is exchanged on the marketplace? The first describes you and is what the Directory filters on;
        the second files your listings.
      </p>

      <Eyebrow className="mt-10 mb-3">Your organisation: its place in the value chain</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        Pick the stages you work in — as many as apply — or the ways you support the chain if you do not
        handle the product yourself. A maker can hold a supporting role too.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-fx-body font-bold text-fx-ink">Stages</h3>
          <ol className="mt-2 flex flex-col gap-1">
            {VALUE_CHAIN_STAGES.map((stage) => (
              <li key={stage.value} className="text-fx-small text-fx-ink2">{stage.label}</li>
            ))}
          </ol>
        </Card>
        <Card className="p-4">
          <h3 className="text-fx-body font-bold text-fx-ink">Supporting the chain</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {SUPPORT_ROLES.map((role) => (
              <li key={role.value} className="text-fx-small text-fx-ink2">{role.label}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Eyebrow className="mt-12 mb-3">Your listings: what is exchanged</Eyebrow>
      <p className="text-fx-body text-fx-ink2">
        A listing is filed under one of {LISTING_TYPES.length - 1} activities, then one of its categories.
      </p>
      <Banner tone="info" className="mt-4">
        Nothing fits? Pick “Something else” — as an activity or as a category — and say what it is in a few
        words. We read them to improve the list.
      </Banner>

      <div className="mt-8 flex flex-col gap-8">
        {LISTING_TYPES.filter((type) => type !== "other").map((type) => (
          <section key={type} aria-labelledby={`type-${type}`}>
            <div className="flex flex-wrap items-baseline gap-3 border-b border-fx-line pb-2">
              <h2 id={`type-${type}`} className="text-fx-title text-fx-ink">
                {LISTING_TYPE_META[type].label}
              </h2>
              <Badge tone={LISTING_TYPE_META[type].tone}>{CATEGORIES_BY_TYPE[type].length} categories</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES_BY_TYPE[type].map((category) => (
                <span key={category} className="rounded-full bg-fx-slate-soft px-3 py-1 text-fx-small font-bold text-fx-ink2">
                  {categoryLabel(category)}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
