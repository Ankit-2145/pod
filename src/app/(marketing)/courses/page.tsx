import { CoursesList } from "@/features/course/course-list";
import { Suspense } from "react";

export default function CoursesPage() {
  return (
    <section className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Our Courses</h1>

      <Suspense fallback={<div>Loading courses...</div>}>
        <CoursesList />
      </Suspense>
    </section>
  );
}
