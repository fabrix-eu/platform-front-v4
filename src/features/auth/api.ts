import { api } from "@/lib/api";

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Creates the user and sends the verification email; no session is opened.
export function register(user: RegisterParams): Promise<void> {
  return api.post("/registrations", { user });
}

export function verifyEmail(token: string): Promise<{ message: string }> {
  return api.get("/registrations/verify", { token });
}

// The API always answers 200 here, whether or not the email exists.
export function requestPasswordReset(email: string): Promise<void> {
  return api.post("/forgot_password", { email });
}

export function resetPassword(params: { token: string; password: string; password_confirmation: string }): Promise<void> {
  return api.post("/reset_password", params);
}
