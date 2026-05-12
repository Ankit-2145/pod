"use client";

import { authClient } from "@/lib/auth/auth-client";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  const onStopImpersonating = () => {
    authClient.admin.stopImpersonating(undefined, {
      onSuccess: () => {
        router.push("/admin");
        refetch();
      },
    });
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button onClick={onStopImpersonating} variant="destructive" size="sm">
        <UserX className="size-4" /> Stop Impersonating ({session.user.name})
      </Button>
    </div>
  );
}
