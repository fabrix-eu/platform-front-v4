import { useId, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { inputClass, labelClass } from "@/components/Field";
import { FieldError, type AnyMutation } from "@/components/FieldError";
import { Button } from "@/components/ui/Button";

interface TagListFieldProps {
  label: string;
  name: string;
  initial: string[];
  mutation: AnyMutation;
  suggestions?: string[];
  placeholder?: string;
  hint?: string;
  inputMode?: "text" | "url";
}

// A free list with suggestions (materials, other certifications, video links): the
// entries live in local state and travel as hidden `name` inputs, read with getAll.
export function TagListField({ label, name, initial, mutation, suggestions = [], placeholder, hint, inputMode = "text" }: TagListFieldProps) {
  const id = useId();
  const [items, setItems] = useState(initial);
  // Ephemeral: the entry being typed.
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (value && !items.some((item) => item.toLowerCase() === value.toLowerCase())) setItems([...items, value]);
    setDraft("");
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault(); // add the entry, do not submit the section
    add();
  };

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {items.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5 rounded-full bg-fx-emphasis py-1.5 pr-2 pl-4 text-fx-small font-bold text-fx-emphasis-ink">
              {item}
              <button type="button" aria-label={`Remove ${item}`} onClick={() => setItems(items.filter((i) => i !== item))} className="rounded-full p-0.5 hover:bg-fx-ink/20">
                <X aria-hidden className="size-3.5" />
              </button>
              <input type="hidden" name={name} value={item} />
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          list={suggestions.length ? `${id}-suggestions` : undefined}
          inputMode={inputMode}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          className={inputClass}
        />
        <Button type="button" variant="secondary" onClick={add} disabled={!draft.trim()}>
          Add
        </Button>
      </div>
      {suggestions.length > 0 && (
        <datalist id={`${id}-suggestions`}>
          {suggestions.filter((s) => !items.includes(s)).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
      {/* Typed but not added: saved all the same rather than silently dropped. */}
      {draft.trim() && <input type="hidden" name={name} value={draft.trim()} />}
      {hint && <p className="mt-1.5 text-fx-small text-fx-muted">{hint}</p>}
      <FieldError mutation={mutation} field={name} />
    </div>
  );
}
