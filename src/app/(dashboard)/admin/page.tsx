import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { requireAuth } from "@/lib/auth/auth-check";

export default async function AdminPage() {
  const session = await requireAuth();

  return (
    <section className=" p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Admin Dashboard
          </CardTitle>
          <CardDescription>
            Welcome, {session.user.name}! Use the sidebar to manage users, view
            analytics, and configure settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select an option from the sidebar to get started.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
