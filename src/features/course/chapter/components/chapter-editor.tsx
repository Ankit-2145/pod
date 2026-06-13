"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { ChapterTitleForm } from "./chapter-title-form";
import { ChapterDescriptionForm } from "./chapter-description-form";
import { ChapterAccessForm } from "./chapter-access-form";
import { ChapterVideoForm } from "./chapter-video-form";
import { ChapterAttachmentsForm } from "./chapter-attachment-form";
import { ChapterActions } from "./chapter-actions";

interface ChapterEditorProps {
  courseId: string;
  chapterId: string;
}

export function ChapterEditor({ courseId, chapterId }: ChapterEditorProps) {
  const trpc = useTRPC();

  const { data: chapter } = useSuspenseQuery(
    trpc.chapter.getById.queryOptions({
      chapterId,
    }),
  );

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/courses/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>

            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>

                <span className="text-sm text-muted-foreground">
                  Complete all fields {completionText}
                </span>
              </div>

              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-lg">Customize your chapter</h2>
              </div>

              <ChapterTitleForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-lg">Access Settings</h2>
              </div>
              <ChapterAccessForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-lg">Add a video URL</h2>
              </div>
              <ChapterVideoForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-lg">Chapter Resources</h2>
              </div>
              <ChapterAttachmentsForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <h2 className="text-lg">Chapter Quiz</h2>
              </div>
              {/* <ChapterQuizForm
                initialData={chapter}
                courseId={courseId}
                chapterId={chapterId}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
