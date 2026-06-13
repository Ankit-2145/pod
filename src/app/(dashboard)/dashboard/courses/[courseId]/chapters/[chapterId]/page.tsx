import { redirect } from "next/navigation";

import prisma from "@/lib/db/prisma";

import { requireAuth } from "@/lib/auth/auth-check";
import { requireCourseAccess } from "@/lib/course/permissions";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ChapterEditor } from "@/features/course/chapter/components/chapter-editor";

type PageProps = {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
};

export default async function ChapterIdPage({ params }: PageProps) {
  const session = await requireAuth();

  const { courseId, chapterId } = await params;

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
    trpc.chapter.getById.queryOptions({
      chapterId,
    }),
  );

  return (
    <HydrateClient>
      <ChapterEditor courseId={courseId} chapterId={chapterId} />
    </HydrateClient>
  );
}
