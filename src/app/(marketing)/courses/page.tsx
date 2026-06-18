import { CoursesList } from "@/features/course/course-list";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export default async function CoursesPage() {
  prefetch(trpc.course.getPublished.queryOptions());

  return (
    <HydrateClient>
      <section className="p-6">
        <h1 className="mb-6 text-3xl font-bold">Our Courses</h1>

        <CoursesList />
      </section>
    </HydrateClient>
  );
}
