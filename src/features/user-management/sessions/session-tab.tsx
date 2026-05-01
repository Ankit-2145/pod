import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { SessionManagement } from "./session-management";

export async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}
