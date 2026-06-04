import { redirect } from "next/navigation";

import { requireAuth } from "@/lib/auth/auth-check";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { canManageCourses } from "@/lib/course/permissions";
import { CoursesView } from "@/features/course/components/course-view";

export default async function CoursePage() {
  const session = await requireAuth();

  if (!canManageCourses(session.user.role)) {
    redirect("/dashboard");
  }

  prefetch(trpc.course.getDashboardCourses.queryOptions());

  return (
    <HydrateClient>
      <CoursesView />
    </HydrateClient>
  );
}
