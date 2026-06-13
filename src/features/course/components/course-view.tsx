"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { DataTable } from "@/components/layouts/data-table";

import { columns } from "@/components/layouts/columns";
import { PlusCircleIcon } from "lucide-react";

export function CoursesView() {
  const trpc = useTRPC();

  const { data: courses } = useSuspenseQuery(
    trpc.course.getInstructorCourses.queryOptions(),
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>

          <p className="text-sm text-muted-foreground">Manage your courses</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        searchColumn="title"
        searchPlaceholder="Filter courses..."
        createHref="/dashboard/courses/create"
        createLabel="New Course"
        createIcon={<PlusCircleIcon className="mr-2 h-4 w-4" />}
      />
    </div>
  );
}
