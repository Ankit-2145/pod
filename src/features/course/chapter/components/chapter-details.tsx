"use client";

import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { Lock } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { RichTextPreview } from "../../text-editor/rich-text-preview";
import { CourseEnrollButton } from "../../enroll-button";

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

  if (data.isLocked) {
    return (
      <section className="mx-auto max-w-3xl space-y-8 p-6">
        <div>
          <h1 className="text-3xl font-bold">{chapter.title}</h1>

          <p className="mt-2 text-muted-foreground">{chapter.course.title}</p>
        </div>

        <div className="rounded-xl border p-10 text-center">
          <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

          <h2 className="text-2xl font-semibold">This chapter is locked</h2>

          <p className="mt-3 text-muted-foreground">
            Purchase the course to unlock this lesson and all remaining
            chapters.
          </p>

          <div className="mt-6">
            <CourseEnrollButton courseId={courseId} isPurchased={false} />
          </div>
        </div>

        {chapter.description && (
          <div className="rounded-xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">Chapter Overview</h2>

            <RichTextPreview value={chapter.description} />
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">{chapter.title}</h1>

        <p className="mt-2 text-muted-foreground">{chapter.course.title}</p>
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

      {!data.isPurchased && !data.canManage && (
        <div className="rounded-lg border bg-muted p-4">
          <p className="text-sm text-muted-foreground">
            You are currently viewing a free preview. Purchase the course to
            unlock all lessons.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        {previousChapter ? (
          data.isPurchased || data.canManage || previousChapter.isFree ? (
            <Link href={`/courses/${courseId}/chapters/${previousChapter.id}`}>
              <Button variant="outline">Previous Chapter</Button>
            </Link>
          ) : (
            <div />
          )
        ) : (
          <div />
        )}

        {nextChapter ? (
          data.isPurchased || data.canManage || nextChapter.isFree ? (
            <Link href={`/courses/${courseId}/chapters/${nextChapter.id}`}>
              <Button>Next Chapter</Button>
            </Link>
          ) : (
            <Button disabled>Next Chapter Locked</Button>
          )
        ) : (
          <Button disabled>Last Chapter</Button>
        )}
      </div>
    </section>
  );
}
