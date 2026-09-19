import { api } from "@/lib/api";

export const FEEDBACK_CATEGORIES = [
  { value: "bug", label: "Something is broken" },
  { value: "feature", label: "I have an idea" },
  { value: "question", label: "I have a question" },
] as const;

export interface FeedbackInput {
  category: string;
  message: string;
  /** The screen they were on, sent by the client: a SPA never updates the referer. */
  context_path: string;
  screenshot?: File | null;
}

export interface Feedback {
  id: string;
  category: string;
  message: string;
  screenshot_url: string | null;
  context_path: string | null;
  created_at: string;
}

// Multipart rather than JSON, because the screenshot travels with it. `api` recognises a
// FormData body and lets the browser set the content type.
export function submitFeedback({ category, message, context_path, screenshot }: FeedbackInput) {
  const body = new FormData();
  body.append("feedback[category]", category);
  body.append("feedback[message]", message);
  body.append("feedback[context_path]", context_path);
  if (screenshot) body.append("screenshot", screenshot);

  return api.post<Feedback>("/feedbacks", body);
}
