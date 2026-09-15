import type { ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Crown, LogOut, MailPlus, MoreHorizontal, UserCog, UserMinus, X } from "lucide-react";
import { ApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { menuContentClass, menuDangerItemClass, menuItemClass, menuSeparatorClass } from "@/components/ui/menu";
import { cancelInvitation, removeMember, resendInvitation, type TeamInvitation, type TeamMember, updateMemberRole } from "./api";

/** A team mutation: refreshes the team (and `me` when it touches you), toasts the outcome. */
function useTeamAction<T>(organizationId: string, action: (arg: T) => Promise<unknown>, success: (arg: T) => string, touchesMe = false) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: action,
    // The API answers "last owner" refusals with a 422 the global handler leaves to forms.
    meta: { silentErrors: true },
    onSuccess: async (_data, arg) => {
      await queryClient.invalidateQueries({ queryKey: ["organizations", organizationId, "team"] });
      if (touchesMe) await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast(success(arg));
    },
    onError: (error) => toast(error instanceof ApiError ? error.message : "Something went wrong. Please try again.", "error"),
  });
}

function ActionsMenu({ label, disabled, children }: { label: string; disabled: boolean; children: ReactNode }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          disabled={disabled}
          className="rounded-fx p-1.5 text-fx-muted outline-none hover:bg-fx-panel hover:text-fx-ink focus-visible:ring-3 focus-visible:ring-fx-emphasis-soft disabled:opacity-50"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className={menuContentClass}>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function MemberActions({ organizationId, member, isSelf }: { organizationId: string; member: TeamMember; isSelf: boolean }) {
  const name = isSelf ? "you" : member.user.name;
  const setRole = useTeamAction(
    organizationId,
    (role: TeamMember["role"]) => updateMemberRole(organizationId, member.id, role),
    (role) => (role === "owner" ? `${member.user.name} is now an owner` : `${isSelf ? "You are" : `${member.user.name} is`} now a manager`),
    isSelf,
  );
  const remove = useTeamAction(organizationId, () => removeMember(organizationId, member.id), () => (isSelf ? "You left the team" : `${member.user.name} was removed`), isSelf);

  return (
    <ActionsMenu label={`Actions for ${name}`} disabled={setRole.isPending || remove.isPending}>
      {member.role === "member" ? (
        <DropdownMenu.Item
          className={menuItemClass}
          onSelect={() => {
            if (window.confirm(`Make ${member.user.name} an owner? Owners can invite and remove people.`)) setRole.mutate("owner");
          }}
        >
          <Crown className="size-4 text-fx-muted" />
          Make owner
        </DropdownMenu.Item>
      ) : (
        <DropdownMenu.Item
          className={menuItemClass}
          onSelect={() => {
            if (!isSelf || window.confirm("Step down to manager? You will no longer manage the team.")) setRole.mutate("member");
          }}
        >
          <UserCog className="size-4 text-fx-muted" />
          {isSelf ? "Step down to manager" : "Make manager"}
        </DropdownMenu.Item>
      )}
      <DropdownMenu.Separator className={menuSeparatorClass} />
      <DropdownMenu.Item
        className={menuDangerItemClass}
        onSelect={() => {
          const question = isSelf ? "Leave the team? You will lose access to this organisation." : `Remove ${member.user.name} from the team?`;
          if (window.confirm(question)) remove.mutate(undefined);
        }}
      >
        {isSelf ? <LogOut className="size-4" /> : <UserMinus className="size-4" />}
        {isSelf ? "Leave the team" : "Remove from team"}
      </DropdownMenu.Item>
    </ActionsMenu>
  );
}

export function InvitationActions({ organizationId, invitation }: { organizationId: string; invitation: TeamInvitation }) {
  const resend = useTeamAction(organizationId, () => resendInvitation(organizationId, invitation.id), () => `Invitation sent again to ${invitation.email}`);
  const cancel = useTeamAction(organizationId, () => cancelInvitation(organizationId, invitation.id), () => "Invitation cancelled");

  return (
    <ActionsMenu label={`Actions for the invitation to ${invitation.email}`} disabled={resend.isPending || cancel.isPending}>
      <DropdownMenu.Item className={menuItemClass} onSelect={() => resend.mutate(undefined)}>
        <MailPlus className="size-4 text-fx-muted" />
        Resend invitation
      </DropdownMenu.Item>
      <DropdownMenu.Separator className={menuSeparatorClass} />
      <DropdownMenu.Item
        className={menuDangerItemClass}
        onSelect={() => {
          if (window.confirm(`Cancel the invitation to ${invitation.email}?`)) cancel.mutate(undefined);
        }}
      >
        <X className="size-4" />
        Cancel invitation
      </DropdownMenu.Item>
    </ActionsMenu>
  );
}
