import { api } from "@/lib/api";
import type { OrganizationPhoto } from "./types";

// /organizations/:id/photos — writes are for the organisation's members and system admins.
// A photo is appended at the end; there is no reorder endpoint.

export function addOrganizationPhoto(orgId: string, photo: { url: string; caption?: string }) {
  return api.post<OrganizationPhoto>(`/organizations/${orgId}/photos`, { photo });
}

export function updateOrganizationPhoto(orgId: string, photoId: string, photo: { caption: string | null }) {
  return api.patch<OrganizationPhoto>(`/organizations/${orgId}/photos/${photoId}`, { photo });
}

export function deleteOrganizationPhoto(orgId: string, photoId: string) {
  return api.delete<void>(`/organizations/${orgId}/photos/${photoId}`);
}
