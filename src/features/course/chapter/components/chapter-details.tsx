"use client";

import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { Lock, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

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
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {chapter.course.title}
          </Link>
          <h1 className="text-4xl font-bold font-heading bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            {chapter.title}
          </h1>
        </div>

        {/* Locked State Card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-card/50 to-background p-8 text-center backdrop-blur-sm sm:p-12">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="mx-auto flex justify-center">
            <div className="rounded-full bg-accent/10 p-4">
              <Lock className="h-8 w-8 text-accent" />
            </div>
          </div>

          <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
            This chapter is locked
          </h2>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Purchase the course to unlock this lesson and all remaining
            chapters.
          </p>

          <div className="mt-8 flex justify-center">
            <CourseEnrollButton courseId={courseId} isPurchased={false} />
          </div>
        </div>

        {/* Chapter Overview */}
        {chapter.description && (
          <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold font-heading">
                Chapter Overview
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <RichTextPreview value={chapter.description} />
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {chapter.course.title}
        </Link>
        <h1 className="text-4xl font-bold font-heading bg-linear-to-r from-primary to-accent bg-clip-text text-transparent sm:text-5xl">
          {chapter.title}
        </h1>
      </div>

      {/* Video Player */}
      {chapter.videoUrl && (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-black/20 backdrop-blur-sm">
          <div className="aspect-video overflow-hidden">
            <ReactPlayer
              src={chapter.videoUrl}
              width="100%"
              height="100%"
              controls
              light
              playing={false}
            />
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Description */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold font-heading">
                Description
              </h2>
            </div>

            {chapter.description ? (
              <div className="prose prose-invert max-w-none">
                <RichTextPreview value={chapter.description} />
              </div>
            ) : (
              <p className="text-muted-foreground">
                No description available for this chapter.
              </p>
            )}
          </div>

          {/* Preview Banner */}
          {!data.isPurchased && !data.canManage && (
            <div className="rounded-2xl border border-accent/20 bg-linear-to-r from-accent/10 to-primary/10 p-4 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">
                ✨ You are currently viewing a free preview. Purchase the course
                to unlock all lessons.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chapter Info Card */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="font-semibold font-heading mb-4">Chapter Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium">
                  {data.isPurchased || data.canManage ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Preview
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-border">
        {previousChapter ? (
          data.isPurchased || data.canManage || previousChapter.isFree ? (
            <Link href={`/courses/${courseId}/chapters/${previousChapter.id}`}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Chapter
              </Button>
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
              <Button size="lg" className="w-full sm:w-auto">
                Next Chapter
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Button disabled size="lg" className="w-full sm:w-auto">
              Next Chapter Locked
              <Lock className="ml-2 h-4 w-4" />
            </Button>
          )
        ) : (
          <Button disabled size="lg" className="w-full sm:w-auto">
            Last Chapter
          </Button>
        )}
      </div>
    </section>
  );
}
