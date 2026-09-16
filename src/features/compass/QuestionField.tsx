import { inputClass, labelClass } from "@/components/Field";
import { Checkbox } from "@/components/ui/Toggles";
import { Pill } from "@/components/ui/Pill";
import { cn } from "@/lib/utils";
import type { Question } from "./types";

interface QuestionFieldProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
}

const asArray = (value: unknown): string[] => (Array.isArray(value) ? (value as string[]) : []);
const asTable = (value: unknown): Record<string, number> => (value && typeof value === "object" ? (value as Record<string, number>) : {});

/** One question, rendered the way its `field_type` asks for. */
export function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const { field_type: type, options } = question;

  if (type === "text" || type === "email") {
    return (
      <input
        type={type === "email" ? "email" : "text"}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder={type === "email" ? "name@organisation.eu" : "Your answer"}
        aria-label={question.text}
        className={inputClass}
      />
    );
  }

  if (type === "select") {
    return (
      <div role="radiogroup" aria-label={question.text} className="flex flex-wrap gap-2">
        {(options.choices ?? []).map((choice) => (
          <Pill
            key={choice.value}
            role="radio"
            aria-checked={value === choice.value}
            selected={value === choice.value}
            onClick={() => onChange(choice.value)}
          >
            {choice.label}
          </Pill>
        ))}
      </div>
    );
  }

  if (type === "multiselect") {
    const selected = asArray(value);
    return (
      <div className="grid gap-3">
        {(options.choices ?? []).map((choice) => (
          <Checkbox
            key={choice.value}
            label={choice.label}
            checked={selected.includes(choice.value)}
            onChange={(e) => onChange(e.currentTarget.checked ? [...selected, choice.value] : selected.filter((v) => v !== choice.value))}
          />
        ))}
      </div>
    );
  }

  if (type === "rating") {
    const scale = options.scale?.length ? options.scale : [1, 2, 3, 4, 5];
    return (
      <div role="radiogroup" aria-label={question.text} className="flex flex-wrap gap-2">
        {scale.map((step) => (
          <Pill key={step} role="radio" aria-checked={value === step} selected={value === step} onClick={() => onChange(step)}>
            {step}
          </Pill>
        ))}
      </div>
    );
  }

  if (type === "table") {
    const rows = options.rows ?? [];
    const scale = options.scale ?? [];
    const table = asTable(value);
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-md border-separate border-spacing-0 text-fx-small">
          <thead>
            <tr>
              <th className="w-1/2 py-2 text-left font-normal text-fx-muted">Statement</th>
              {scale.map((step) => (
                <th key={step} className="px-2 py-2 text-center font-bold text-fx-ink2">
                  {step}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.value}>
                <td className="border-t border-fx-line py-3 pr-4 text-fx-ink2">{row.label}</td>
                {scale.map((step) => {
                  const checked = table[row.value] === step;
                  return (
                    <td key={step} className="border-t border-fx-line px-2 py-3 text-center">
                      <label className="inline-flex cursor-pointer items-center justify-center">
                        <input
                          type="radio"
                          name={`${question.key}-${row.value}`}
                          checked={checked}
                          onChange={() => onChange({ ...table, [row.value]: step })}
                          className="peer sr-only"
                          aria-label={`${row.label}: ${step}`}
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "size-5 rounded-full border-2 border-fx-line2 transition",
                            "peer-checked:border-fx-emphasis peer-checked:bg-fx-emphasis",
                            "peer-focus-visible:ring-3 peer-focus-visible:ring-fx-emphasis-soft",
                          )}
                        />
                      </label>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <p className={labelClass}>This question type is not supported yet.</p>;
}
