import { useState } from "react";
import { labelClass } from "@/components/Field";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Pill } from "@/components/ui/Pill";
import { CATEGORIES_BY_TYPE, categoryLabel, LISTING_TYPE_META, LISTING_TYPES, subcategoryOptions } from "@/features/listings/taxonomy";

// Specialties share the listing taxonomy: a partner who searches "sorting" finds both
// the listings and the organisations that do it. Values travel as hidden `specialties` inputs.
export function SpecialtiesField({ initial = [] }: { initial?: string[] }) {
  // Multi-select with dependent children: local state, mirrored into FormData.
  const [selected, setSelected] = useState<string[]>(initial);
  const has = (value: string) => selected.includes(value);

  const toggleCategory = (category: string) => {
    const children = subcategoryOptions(category).map((s) => s.value);
    setSelected((prev) => (prev.includes(category) ? prev.filter((v) => v !== category && !children.includes(v)) : [...prev, category]));
  };
  const toggle = (value: string) => setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  return (
    <fieldset>
      <legend className={labelClass}>What you do</legend>
      <p className="text-fx-small text-fx-muted">Pick the areas you work in, then refine. Partners and facilitators find you by them.</p>

      <div className="mt-5 space-y-6">
        {LISTING_TYPES.map((type) => (
          <div key={type}>
            <Eyebrow className="mb-2.5">{LISTING_TYPE_META[type].label}</Eyebrow>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_BY_TYPE[type].map((category) => (
                <Pill key={category} selected={has(category)} onClick={() => toggleCategory(category)}>
                  {categoryLabel(category)}
                </Pill>
              ))}
            </div>
            {CATEGORIES_BY_TYPE[type].filter(has).map((category) => (
              <div key={category} className="mt-3 border-l-2 border-fx-emphasis-soft pl-4">
                <p className="mb-2 text-fx-small text-fx-muted">{categoryLabel(category)} — more precisely</p>
                <div className="flex flex-wrap gap-1.5">
                  {subcategoryOptions(category).map((sub) => (
                    <Pill key={sub.value} selected={has(sub.value)} onClick={() => toggle(sub.value)} className="px-3 py-1.5">
                      {sub.label}
                    </Pill>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selected.length > 0 && <p className="mt-4 text-fx-small font-bold text-fx-ink2">{selected.length} selected</p>}
      {selected.map((value) => (
        <input key={value} type="hidden" name="specialties" value={value} />
      ))}
    </fieldset>
  );
}
