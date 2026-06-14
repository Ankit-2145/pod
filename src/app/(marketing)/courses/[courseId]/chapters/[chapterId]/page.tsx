import { ChapterDetails } from "@/features/course/chapter/components/chapter-details";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

type PageProps = {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
};

export default async function ChapterPage({ params }: PageProps) {
  const { courseId, chapterId } = await params;

  prefetch(
    trpc.chapter.getDetails.queryOptions({
      courseId,
      chapterId,
    }),
  );

  return (
    <HydrateClient>
      <ChapterDetails courseId={courseId} chapterId={chapterId} />
    </HydrateClient>
  );
}
