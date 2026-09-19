// The Compass is the assessment system: a Form holds Sections, a Section holds
// Questions, and an organisation's Answer carries every response in one JSON blob.
// These endpoints answer with plain ActiveRecord JSON, not the usual `{ data }`.

export const FIELD_TYPES = ["text", "email", "select", "multiselect", "rating", "table"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export interface Choice {
  label: string;
  value: string;
  /** What the choice is worth; `null` reads as "does not apply to us". */
  points?: number | null;
}

export interface TableRow {
  label: string;
  value: string;
  points_per_value?: Record<string, number>;
}

export interface QuestionOptions {
  choices?: Choice[];
  rows?: TableRow[];
  scale?: number[];
  points?: number;
}

/** Shown only when the answer to another question matches. */
export interface QuestionCondition {
  depends_on?: string;
  operator?: "equals" | "not_equals" | "in" | "not_in";
  values?: unknown;
}

export interface Question {
  id: string;
  key: string;
  text: string;
  description: string | null;
  hint: string | null;
  field_type: FieldType;
  options: QuestionOptions;
  condition: QuestionCondition;
  required: boolean;
  position: number;
}

export interface Section {
  id: string;
  key: string;
  title: string;
  description: string | null;
  position: number;
  questions: Question[];
}

export interface CompassForm {
  id: string;
  key: string;
  title: string;
  description: string | null;
  icon_name: string;
  position: number;
}

/** GET /forms/:idOrKey — the whole questionnaire. */
export interface CompassFormWithSections extends CompassForm {
  sections: Section[];
}

export type AnswerStatus = "draft" | "in_progress" | "completed";

/** What a score means and what to do about it. Authored per form, server-side — the
 *  client renders the band it is handed rather than holding the matching rule. */
export interface ResultBand {
  min: number;
  max: number;
  title: string;
  body?: string | null;
  advice?: string[] | null;
}

export interface Answer {
  id: string;
  form_id: string;
  organization_id: string;
  user_id: string;
  status: AnswerStatus;
  responses: Record<string, unknown>;
  total_points: number | null;
  /** 0–100, and only meaningful once it is completed. */
  normalized_score: number | null;
  /** Null until the form has bands authored: then the score shows without advice. */
  result_band: ResultBand | null;
  created_at: string;
  updated_at: string;
}

/** GET /forms?organization_id= — each form with that organisation's answers. */
export interface CompassFormWithAnswers extends CompassForm {
  answers: Answer[];
}
