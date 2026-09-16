import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { deleteMe } from "./api";

export function DangerZone() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: async () => {
      await deleteMe();
      // The account is gone, so the token is worthless — clear it either way.
      await logout().catch(() => {});
    },
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: "/" });
    },
  });

  return (
    <section className="max-w-xl">
      <h2 className="text-fx-heading text-fx-rose">Delete your account</h2>
      <p className="mt-2 text-fx-body text-fx-ink2">
        This removes your account and signs you out. Organisations you belong to stay on FABRIX — hand
        ownership to someone else first if you are their only owner.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="mt-4 text-fx-rose">
            Delete my account
          </Button>
        </DialogTrigger>
        <DialogContent
          title="Delete your account?"
          description="This cannot be undone. Your profile and your messages go with it."
          footer={
            <div className="flex flex-wrap justify-end gap-3">
              <DialogClose asChild>
                <Button variant="ghost">Keep my account</Button>
              </DialogClose>
              <Button variant="danger" disabled={remove.isPending} onClick={() => remove.mutate()}>
                {remove.isPending ? "Deleting…" : "Delete my account"}
              </Button>
            </div>
          }
        >
          <p className="text-fx-body text-fx-ink2">
            You will be signed out straight away and will not be able to sign back in with this email.
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
