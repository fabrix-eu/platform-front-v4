import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { updateOrganization } from "../../api";
import type { OrganizationProfile } from "../../types";
import { TagListField } from "./TagListField";

// Video links (YouTube, Vimeo…) — a list of web links, saved on their own.
export function VideoLinksForm({ org }: { org: OrganizationProfile }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof updateOrganization>[1]) => updateOrganization(org.id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", "profile"] });
      toast("Videos saved");
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({ video_urls: new FormData(e.currentTarget).getAll("video_urls").map(String) });
      }}
    >
      <FormError mutation={mutation} fields={["video_urls"]} />
      <TagListField
        label="Video links"
        name="video_urls"
        initial={org.video_urls}
        inputMode="url"
        placeholder="https://vimeo.com/…"
        hint="A tour of the workshop, a talk, a product film."
        mutation={mutation}
      />
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save videos"}
        </Button>
      </div>
    </form>
  );
}
