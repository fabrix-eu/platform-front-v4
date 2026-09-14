import { api } from "@/lib/api";
import type { OrganizationDraft } from "@/features/organizations/types";

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// The three signups create the user and send the verification email; none opens a session.

export function register(user: RegisterParams): Promise<void> {
  return api.post("/registrations", { user });
}

/** The user and a new organisation they own, in one transaction. */
export function registerWithOrganization(user: RegisterParams, organization: OrganizationDraft): Promise<void> {
  return api.post("/registrations/with_organization", { user, organization });
}

/** The user and a claim on an existing, unclaimed organisation (reviewed by the FABRIX team). */
export function registerWithClaim(user: RegisterParams, organizationId: string): Promise<void> {
  return api.post("/registrations/with_claim", { user, organization_id: organizationId });
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
