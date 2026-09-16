import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentOrg } from "@/lib/activeOrg";
import { FormError } from "@/components/FieldError";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/Button";
import { cancelRsvp, participantsQueryOptions, rsvp } from "./api";
import { RSVP_LABELS, RSVP_STATUSES, type RsvpStatus } from "./types";

/** One RSVP per person: answering again changes it, clicking the current one takes it back. */
export function RsvpButtons({ eventId, past }: { eventId: string; past: boolean }) {
  const { me } = useCurrentOrg();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: participants } = useQuery(participantsQueryOptions(eventId));
  const mine = participants?.find((participant) => participant.user.id === me.id);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["events", "participants", eventId] });
  const answer = useMutation({
    mutationFn: (status: RsvpStatus) => rsvp(eventId, status),
    onSuccess: async (_data, status) => {
      await refresh();
      toast(status === "going" ? "See you there" : `Noted: ${RSVP_LABELS[status].toLowerCase()}`);
    },
  });
  const take_back = useMutation({
    mutationFn: (participantId: string) => cancelRsvp(eventId, participantId),
    onSuccess: async () => {
      await refresh();
      toast("Your answer was removed");
    },
  });

  const busy = answer.isPending || take_back.isPending;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {RSVP_STATUSES.map((status) => {
          const active = mine?.status === status;
          return (
            <Button
              key={status}
              size="sm"
              variant={active ? "primary" : "secondary"}
              disabled={busy}
              aria-pressed={active}
              onClick={() => (active && mine ? take_back.mutate(mine.id) : answer.mutate(status))}
            >
              {RSVP_LABELS[status]}
            </Button>
          );
        })}
      </div>
      <p className="mt-2 text-fx-small text-fx-muted">
        {mine ? "Click your answer again to take it back." : past ? "It already happened — you can still say you were there." : "Let the organisers know."}
      </p>
      <FormError mutation={answer} />
      <FormError mutation={take_back} />
    </div>
  );
}
