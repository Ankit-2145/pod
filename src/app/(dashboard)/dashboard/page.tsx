import { DashboardCourses } from "@/features/course/dashboard-course";
import { requireAuth } from "@/lib/auth/auth-check";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function DashboardPage() {
  const session = await requireAuth();

  prefetch(trpc.course.getMany.queryOptions());

  return (
    <HydrateClient>
      <section className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">
            Hi {session.user.name}&apos;s Dashboard
          </h1>

          <p className="text-muted-foreground">
            Manage your courses and platform activity
          </p>
        </div>

        <DashboardCourses />
      </section>
    </HydrateClient>
  );
}
