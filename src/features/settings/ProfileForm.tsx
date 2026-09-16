import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";
import { Field } from "@/components/Field";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { updateMe } from "./api";

export function ProfileForm({ me }: { me: User }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const picker = useRef<HTMLInputElement>(null);
  // Ephemeral: the upload is in flight.
  const [uploading, setUploading] = useState(false);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["me"] });
  const save = useMutation({ mutationFn: updateMe, meta: { silentErrors: true }, onSuccess: refresh });
  const photo = useMutation({ mutationFn: updateMe, onSuccess: refresh });

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const image_url = await uploadFile(file, "User", me.id);
      await photo.mutateAsync({ image_url });
      toast("Photo updated");
    } finally {
      setUploading(false);
      if (picker.current) picker.current.value = "";
    }
  };

  return (
    <section className="max-w-xl">
      <h2 className="text-fx-heading text-fx-ink">Profile</h2>

      <div className="mt-5 flex items-center gap-4">
        <Avatar name={me.name} src={me.image_url} kind="person" size="lg" />
        <div className="flex flex-wrap gap-2">
          <input
            ref={picker}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => void pick(e.currentTarget.files?.[0])}
          />
          <Button variant="secondary" size="sm" disabled={uploading} onClick={() => picker.current?.click()}>
            {uploading ? "Uploading…" : me.image_url ? "Change photo" : "Add a photo"}
          </Button>
          {me.image_url && (
            <Button variant="ghost" size="sm" disabled={photo.isPending} onClick={() => photo.mutate({ image_url: null })}>
              Remove
            </Button>
          )}
        </div>
      </div>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          const name = String(new FormData(e.currentTarget).get("name") ?? "").trim();
          save.mutate({ name }, { onSuccess: () => toast("Profile updated") });
        }}
      >
        <FormError mutation={save} fields={["name"]} />
        <Field label="Name" name="name" required defaultValue={me.name} autoComplete="name" mutation={save} />
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </section>
  );
}
