import { CoursesGrid } from "@/components/course-grid";
import { Suspense } from "react";

export default function CoursesPage() {
  return (
    <section className="p-6">
      <Suspense fallback={<div>Loading courses...</div>}>
        <CoursesGrid />
      </Suspense>
    </section>
  );
}
