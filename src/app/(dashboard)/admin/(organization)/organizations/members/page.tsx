import { Card, CardContent } from "@/components/ui/card";
import { MembersTab } from "@/features/organizations/components/members-tab";

export default function MembersPage() {
  return (
    <div className="container mx-auto my-6 px-4">
      <Card>
        <CardContent>
          <MembersTab />
        </CardContent>
      </Card>
    </div>
  );
}
