import { api } from "./api";

export type UploadModel = "Listing" | "Organization" | "Event" | "User";

// Direct-to-S3: the API signs a PUT for a record, the browser uploads the bytes
// straight to the bucket, and the public URL is the signed one without its query.
export async function uploadFile(file: File, model: UploadModel, modelId: string): Promise<string> {
  const { url } = await api.get<{ url: string; key: string }>("/uploads/presigned_url", {
    model,
    model_id: modelId,
    filename: `${Date.now()}-${file.name}`,
    content_type: file.type,
  });

  const res = await fetch(url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!res.ok) throw new Error("File upload failed");

  return url.split("?")[0];
}
