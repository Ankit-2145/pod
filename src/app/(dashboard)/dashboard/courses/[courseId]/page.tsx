import { redirect } from "next/navigation";

import prisma from "@/lib/db/prisma";

import { requireAuth } from "@/lib/auth/auth-check";
import { Editor } from "@/features/course/components/editor";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { requireCourseAccess } from "@/lib/course/permissions";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

const CourseIdPage = async ({ params }: PageProps) => {
  const session = await requireAuth();

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },

    select: {
      id: true,
      authorId: true,
    },
  });

  if (!course) {
    redirect("/dashboard/courses");
  }

  requireCourseAccess(session.user, course);

  prefetch(
    trpc.course.getById.queryOptions({
      courseId,
    }),
  );

  return (
    <HydrateClient>
      <Editor courseId={courseId} />
    </HydrateClient>
  );
};

export default CourseIdPage;
