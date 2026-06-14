import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stats } from "@/features/admin/users-management/components/stats";

import { requireAuth } from "@/lib/auth/auth-check";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function AdminPage() {
  const session = await requireAuth();

  prefetch(trpc.analytics.getAdminStats.queryOptions());

  return (
    <HydrateClient>
      <section className="space-y-8 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>

            <CardDescription>
              Welcome, {session.user.name}! Use the sidebar to manage users,
              courses, and platform settings.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select an option from the sidebar to get started.
            </p>
          </CardContent>
        </Card>

        <Stats />
      </section>
    </HydrateClient>
  );
}
