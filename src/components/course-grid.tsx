"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { CourseCard } from "./course-card";

export function CoursesGrid() {
  const trpc = useTRPC();

  const { data: courses } = useSuspenseQuery(
    trpc.course.getPublished.queryOptions(),
  );

  return (
    <>
      {courses.map((course) => (
        <div
          key={course.id}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <CourseCard
            title={course.title}
            imageUrl={course.imageUrl}
            chapterCount={course.chapters.length}
            description={course.description}
          />
        </div>
      ))}
    </>
  );
}
