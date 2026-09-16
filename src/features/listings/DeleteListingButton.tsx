import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { deleteListing, LISTINGS_KEY } from "./api";

interface DeleteListingButtonProps {
  listingId: string;
  /** Named in the confirmation, so nobody deletes the wrong one. */
  title: string;
  /** Without it, the trash icon stands alone — for a row or a card. */
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** The listing is gone: leave its page, for instance. */
  onDeleted?: () => void;
}

/** Deleting a listing, wherever its organisation's members meet it. */
export function DeleteListingButton({ listingId, title, label, variant = "ghost", size = "sm", className, onDeleted }: DeleteListingButtonProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: () => deleteListing(listingId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: LISTINGS_KEY });
      toast(`“${title}” was deleted`);
      onDeleted?.();
    },
  });

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={mutation.isPending}
      aria-label={label ? undefined : `Delete ${title}`}
      title={label ? undefined : `Delete ${title}`}
      onClick={() => {
        if (window.confirm(`Delete “${title}”? It leaves the Marketplace and your profile. This cannot be undone.`)) mutation.mutate();
      }}
    >
      <Trash2 className="size-4" />
      {label && (mutation.isPending ? "Deleting…" : label)}
    </Button>
  );
}
