import Link from "next/link";

import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/auth-check";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/layouts/data-table";
import { columns } from "@/components/layouts/columns";

export default async function CoursePage() {
  const session = await requireAuth();

  const isInstructor = session.user.role === "INSTRUCTOR";

  const isAdmin = session.user.role === "admin";

  if (!isInstructor && !isAdmin) {
    return (
      <section className="p-4">
        <h1 className="mb-4 text-2xl font-bold">
          You are not authorized to view this page
        </h1>
      </section>
    );
  }

  const courses = await prisma.course.findMany({
    where: isAdmin
      ? {}
      : {
          authorId: session.user.id,
        },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>

          <p className="text-sm text-muted-foreground">Manage your courses</p>
        </div>
      </div>

      <DataTable columns={columns} data={courses} />
    </div>
  );
}
