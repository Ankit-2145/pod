"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export function InviteInformation({
  invitation,
}: {
  invitation: { id: string; organizationId: string };
}) {
  const router = useRouter();

  function acceptInvite() {
    return authClient.organization.acceptInvitation(
      { invitationId: invitation.id },
      {
        onSuccess: async () => {
          await authClient.organization.setActive({
            organizationId: invitation.organizationId,
          });
          router.push("/profile");
        },
      },
    );
  }
  function rejectInvite() {
    return authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      { onSuccess: () => router.push("/") },
    );
  }

  return (
    <div className="flex gap-4">
      <Button className="grow" onClick={acceptInvite}>
        Accept
      </Button>
      <Button className="grow" variant="destructive" onClick={rejectInvite}>
        Reject
      </Button>
    </div>
  );
}
