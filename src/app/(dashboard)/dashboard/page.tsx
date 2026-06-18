import { Badge } from "@/components/ui/badge";
import { DashboardCourses } from "@/features/course/dashboard-course";
import { requireAuth } from "@/lib/auth/auth-check";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function DashboardPage() {
  const session = await requireAuth();
  const role = (session.user.role ?? "user") as
    | "user"
    | "admin"
    | "instructor"
    | "superAdmin";

  prefetch(trpc.course.getDashboardCourses.queryOptions());

  return (
    <HydrateClient>
      <section className="space-y-6 p-6">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Hi {session.user.name}</h1>
            <Badge>{session.user.role}</Badge>
          </div>
          <p className="text-muted-foreground">
            Welcome to Dashboard, you can manage your courses
          </p>
        </div>

        <DashboardCourses role={role} />
      </section>
    </HydrateClient>
  );
}
