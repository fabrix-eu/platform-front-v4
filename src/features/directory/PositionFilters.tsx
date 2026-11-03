import { useNavigate } from "@tanstack/react-router";
import { csvList, toggleCsv } from "@/lib/csv";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MultiSelectMenu } from "@/components/ui/MultiSelectMenu";
import { Pill } from "@/components/ui/Pill";
import { LISTING_TYPE_META, LISTING_TYPES } from "@/features/listings/taxonomy";
import { SUPPORT_ROLES, VALUE_CHAIN_STAGES } from "@/features/organizations/position";
import type { DirectorySearch } from "./search";

type CsvKey = "stages" | "support" | "offering";

function useToggle(key: CsvKey, current?: string) {
  const navigate = useNavigate({ from: "/global" });
  const set = (value: string | undefined) => navigate({ search: (prev) => ({ ...prev, [key]: value }), replace: true, resetScroll: false });
  return { toggle: (value: string) => set(toggleCsv(current, value)), clear: () => set(undefined) };
}

/** Where an organisation sits: the seven stages of the chain, in order. */
export function StageFilter({ stages }: Pick<DirectorySearch, "stages">) {
  const { toggle } = useToggle("stages", stages);
  const selected = csvList(stages);

  return (
    <div>
      <Eyebrow className="mb-3">In the value chain</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {VALUE_CHAIN_STAGES.map((stage) => (
          <Pill key={stage.value} selected={selected.includes(stage.value)} onClick={() => toggle(stage.value)}>
            {stage.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}

/** How an organisation supports the chain — eight roles, behind a menu. */
export function SupportFilter({ support }: Pick<DirectorySearch, "support">) {
  const { toggle, clear } = useToggle("support", support);

  return (
    <div>
      <Eyebrow className="mb-3">Supporting the chain</Eyebrow>
      <MultiSelectMenu label="How they support it" options={SUPPORT_ROLES} selected={csvList(support)} onToggle={toggle} onClear={clear} />
    </div>
  );
}

/** What an organisation offers on the marketplace right now, in the marketplace's hues. */
export function OfferingFilter({ offering }: Pick<DirectorySearch, "offering">) {
  const { toggle } = useToggle("offering", offering);
  const selected = csvList(offering);

  return (
    <div>
      <Eyebrow className="mb-3">On the marketplace</Eyebrow>
      <div className="flex flex-wrap gap-2">
        {LISTING_TYPES.filter((type) => type !== "other").map((type) => (
          <Pill key={type} tone={LISTING_TYPE_META[type].tone} selected={selected.includes(type)} onClick={() => toggle(type)}>
            {LISTING_TYPE_META[type].label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
