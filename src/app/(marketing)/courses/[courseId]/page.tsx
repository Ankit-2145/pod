import { CourseDetails } from "@/features/course/components/user-side/course-details";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

const CourseIdPage = async ({ params }: PageProps) => {
  const { courseId } = await params;

  await prefetch(
    trpc.course.getPublicCourseDetails.queryOptions({
      courseId,
    }),
  );

  return (
    <HydrateClient>
      <CourseDetails courseId={courseId} />
    </HydrateClient>
  );
};

export default CourseIdPage;
