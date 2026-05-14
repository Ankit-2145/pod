import { OrganizationTabs } from "@/components/dashboard/organization-tabs";
import { requireAuth } from "@/lib/auth/auth-check";

export default async function OrganizationPage() {
  await requireAuth();

  return (
    <div className="container mx-auto my-6 px-4">
      <OrganizationTabs />
    </div>
  );
}
