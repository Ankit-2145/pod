import { requireAuth } from "@/lib/auth/auth-check";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CoursesView } from "@/features/course/components/course-view";

export default async function CoursePage() {
  await requireAuth();

  prefetch(trpc.course.getInstructorCourses.queryOptions());

  return (
    <HydrateClient>
      <CoursesView />
    </HydrateClient>
  );
}
