import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONVERSATIONS_KEY, sendMessage } from "./api";

interface MessageComposerProps {
  conversationId: string;
  /** Reply in the name of this organisation; omitted = as myself. */
  authorOrganizationId?: string;
  /** Who the other side will see — an organisation's mailbox answers in its name. */
  replyingAs: string;
}

export function MessageComposer({ conversationId, authorOrganizationId, replyingAs }: MessageComposerProps) {
  const queryClient = useQueryClient();
  const form = useRef<HTMLFormElement>(null);

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      form.current?.reset();
      // Refreshes the thread and the mailbox's last message in one go.
      queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY });
    },
  });

  return (
    <form
      ref={form}
      className="shrink-0 border-t border-fx-line p-3"
      onSubmit={(e) => {
        e.preventDefault();
        const content = String(new FormData(e.currentTarget).get("content") ?? "").trim();
        if (!content) return;
        mutation.mutate({ conversationId, content, author_organization_id: authorOrganizationId });
      }}
    >
      <div className="flex items-end gap-2">
        <textarea
          name="content"
          rows={2}
          required
          aria-label={`Message, as ${replyingAs}`}
          placeholder="Write a message…"
          className="min-h-11 flex-1 resize-y rounded-fx border border-fx-line2 bg-fx-paper px-3 py-2 text-fx-body text-fx-ink placeholder:text-fx-muted focus:border-fx-emphasis focus:ring-3 focus:ring-fx-emphasis-soft focus:outline-none"
          onKeyDown={(e) => {
            // Enter sends, Shift+Enter starts a new line — what a messenger does.
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <Button type="submit" disabled={mutation.isPending} aria-label="Send message">
          <SendHorizontal aria-hidden className="size-4" />
          <span className="max-sm:sr-only">{mutation.isPending ? "Sending…" : "Send"}</span>
        </Button>
      </div>
      <p className="mt-1.5 text-fx-label text-fx-muted">Replying as {replyingAs}</p>
    </form>
  );
}
