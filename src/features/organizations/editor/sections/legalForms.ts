import type { SelectOption } from "@/components/SelectField";

// The prototype's "What kind of organisation are you?" choices, stored in legal_form.
export const LEGAL_FORMS: SelectOption[] = [
  { value: "company", label: "Company" },
  { value: "sole_trader", label: "Sole trader" },
  { value: "partnership", label: "Partnership" },
  { value: "non_profit", label: "Non-profit / association" },
  { value: "cooperative", label: "Cooperative" },
  { value: "university_research", label: "University / research body" },
  { value: "public_body", label: "Public body" },
  { value: "other", label: "Other" },
];

// legal_form is free text on the API: a value saved earlier (e.g. "sarl") stays selectable.
export function legalFormOptions(current: string | null | undefined): SelectOption[] {
  return current && !LEGAL_FORMS.some((o) => o.value === current) ? [...LEGAL_FORMS, { value: current, label: current }] : LEGAL_FORMS;
}
