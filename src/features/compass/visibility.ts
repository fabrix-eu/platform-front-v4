import type { Question } from "./types";

export type Responses = Record<string, unknown>;

/**
 * A question can depend on the answer to another one. Shared by the questionnaire
 * and by the read-only view a facilitator gets of an organisation's answers.
 */
export function isVisible(question: Question, responses: Responses): boolean {
  const { depends_on: dependsOn, operator, values } = question.condition ?? {};
  if (!dependsOn || !operator) return true;
  if (!(dependsOn in responses)) return false;
  const actual = responses[dependsOn];
  switch (operator) {
    case "equals":
      return actual === values;
    case "not_equals":
      return actual !== values;
    case "in":
      return Array.isArray(values) && values.includes(actual);
    case "not_in":
      return Array.isArray(values) && !values.includes(actual);
    default:
      return true;
  }
}
