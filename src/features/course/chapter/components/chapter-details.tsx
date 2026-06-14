"use client";

import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { RichTextPreview } from "../../text-editor/rich-text-preview";

type Props = {
  courseId: string;
  chapterId: string;
};

export function ChapterDetails({ courseId, chapterId }: Props) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.chapter.getDetails.queryOptions({
      courseId,
      chapterId,
    }),
  );

  const { chapter, previousChapter, nextChapter } = data;

  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">{chapter.title}</h1>

        <p className="text-muted-foreground mt-2">{chapter.course.title}</p>
      </div>

      {chapter.videoUrl && (
        <div className="aspect-video overflow-hidden rounded-lg border">
          <ReactPlayer
            src={chapter.videoUrl}
            width="100%"
            height="100%"
            controls
          />
        </div>
      )}

      <div className="rounded-xl border p-6">
        <h2 className="mb-4 text-xl font-semibold">Description</h2>
        {chapter.description ? (
          <RichTextPreview value={chapter.description} />
        ) : (
          <p className="text-muted-foreground">
            No description available for this chapter.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        {previousChapter ? (
          <Link href={`/courses/${courseId}/chapters/${previousChapter.id}`}>
            <Button variant="outline">Previous Chapter</Button>
          </Link>
        ) : (
          <div />
        )}

        {nextChapter ? (
          <Link href={`/courses/${courseId}/chapters/${nextChapter.id}`}>
            <Button>Next Chapter</Button>
          </Link>
        ) : (
          <Button disabled>Last Chapter</Button>
        )}
      </div>
    </section>
  );
}
