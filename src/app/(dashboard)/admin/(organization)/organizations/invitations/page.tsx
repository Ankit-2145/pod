import { Card, CardContent } from "@/components/ui/card";
import { InvitesTab } from "@/features/organizations/components/invites-tab";

export default function InvitationsPage() {
  return (
    <div className="container mx-auto my-6 px-4">
      <Card>
        <CardContent>
          <InvitesTab />
        </CardContent>
      </Card>
    </div>
  );
}
