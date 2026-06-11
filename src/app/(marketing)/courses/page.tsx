import { CoursesList } from "@/features/course/course-list";
import { requireAuth } from "@/lib/auth/auth-check";
import { Suspense } from "react";

export default async function CoursesPage() {
  await requireAuth();

  return (
    <section className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Our Courses</h1>

      <Suspense fallback={<div>Loading courses...</div>}>
        <CoursesList />
      </Suspense>
    </section>
  );
}
