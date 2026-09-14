import { api } from "@/lib/api";

// The API always answers 200 here, whether or not the email exists.
export function requestPasswordReset(email: string): Promise<void> {
  return api.post("/forgot_password", { email });
}

export function resetPassword(params: { token: string; password: string; password_confirmation: string }): Promise<void> {
  return api.post("/reset_password", params);
}

// Registration still lives on the current front until the v4 signup flow is rebuilt.
export const SIGNUP_URL = "https://platform.fabrixproject.eu/register";
