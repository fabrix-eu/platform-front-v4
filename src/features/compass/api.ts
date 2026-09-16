import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Answer, CompassFormWithAnswers, CompassFormWithSections } from "./types";

export const COMPASS_KEY = ["compass"];

/**
 * GET /forms?organization_id= — every questionnaire with this organisation's answers
 * attached, so the list needs one call. The onboarding and needs forms are left out
 * by the API itself.
 */
export const compassFormsQueryOptions = (organizationId: string) =>
  queryOptions({
    queryKey: ["compass", "forms", organizationId],
    queryFn: () => api.get<CompassFormWithAnswers[]>("/forms", { organization_id: organizationId }),
  });

/** GET /forms/:idOrKey — the questionnaire itself, sections and questions included. */
export const compassFormQueryOptions = (formKey: string) =>
  queryOptions({
    queryKey: ["compass", "form", formKey],
    queryFn: () => api.get<CompassFormWithSections>(`/forms/${formKey}`),
  });

/** GET /answers/latest — 404 when this organisation has never started it. */
export const latestAnswerQueryOptions = (formId: string, organizationId: string) =>
  queryOptions({
    queryKey: ["compass", "answer", formId, organizationId],
    queryFn: () => api.get<Answer>("/answers/latest", { form_id: formId, organization_id: organizationId }),
    retry: false,
  });

export const createAnswer = (payload: { form_id: string; organization_id: string; responses: Record<string, unknown> }) =>
  api.post<Answer>("/answers", { answer: payload });

/** The API deep-merges what it receives into the answer it already holds. */
export const updateAnswer = (id: string, responses: Record<string, unknown>) => api.patch<Answer>(`/answers/${id}`, { answer: { responses } });
