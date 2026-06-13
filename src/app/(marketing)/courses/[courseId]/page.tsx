import { redirect } from "next/navigation";

import prisma from "@/lib/db/prisma";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

const CourseIdPage = async ({ params }: PageProps) => {
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
    redirect("/courses");
  }

  prefetch(
    trpc.course.getById.queryOptions({
      courseId,
    }),
  );

  return (
    <HydrateClient>
      <div className="p-6">
        <h1 className="mb-6 text-3xl font-bold">{courseId}</h1>
        <p>Course details will go here.</p>
        <div className="mt-4 text-sm text-gray-500"></div>
      </div>
    </HydrateClient>
  );
};

export default CourseIdPage;
