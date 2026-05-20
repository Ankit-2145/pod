import { redirect } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { requireAuth } from "@/lib/auth/auth-check";

import { LayoutDashboard } from "lucide-react";

import { TitleForm } from "./_components/title-form";
// import { DescriptionForm } from "./_components/description-form";
// import { ImageForm } from "./_components/image-form";
// import { ChaptersForm } from "./_components/chapters-form";
// import { Actions } from "./_components/actions";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CourseIdPage({ params }: PageProps) {
  const session = await requireAuth();

  const { courseId } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    trpc.course.getById.queryOptions({
      id: courseId,
    }),
  );

  const course = await queryClient.fetchQuery(
    trpc.course.getById.queryOptions({
      id: courseId,
    }),
  );

  if (!course) {
    return redirect("/dashboard");
  }

  if (course.userId !== session.user.id) {
    return redirect("/dashboard");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    // course.chapters.length > 0,
  ];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  //   const isComplete = requiredFields.every(Boolean);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Course Setup</h1>

            <p className="text-sm text-muted-foreground">
              Complete all required fields {completionText}
            </p>
          </div>

          {/* <Actions
            courseId={courseId}
            disabled={!isComplete}
            isPublished={course.isPublished}
          /> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />

              <h2 className="text-xl font-medium">Course Details</h2>
            </div>

            <TitleForm initialData={course} courseId={courseId} />

            {/* <DescriptionForm initialData={course} courseId={courseId} /> */}

            {/* <ImageForm initialData={course} courseId={courseId} /> */}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-4">Chapters</h2>

              {/* <ChaptersForm initialData={course} courseId={courseId} /> */}
            </div>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
