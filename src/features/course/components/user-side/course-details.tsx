"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { RichTextPreview } from "../../text-editor/rich-text-preview";
import { CourseEnrollButton } from "../../enroll-button";
import { formatPrice } from "@/lib/course/format";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CourseDetailsProps {
  courseId: string;
}

export function CourseDetails({ courseId }: CourseDetailsProps) {
  const trpc = useTRPC();

  const { data: course } = useSuspenseQuery(
    trpc.course.getPublicCourseDetails.queryOptions({
      courseId,
    }),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative w-full bg-linear-to-br from-background via-background to-accent/5">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
          {/* Course Image */}
          {course.imageUrl && (
            <div className="mb-12 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={course.imageUrl}
                alt={course.title}
                className="aspect-video w-full object-cover"
                width={1280}
                height={720}
              />
            </div>
          )}

          {/* Course Header */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4">
              {course.category && (
                <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-fontUrbanist font-semibold text-accent">
                  {course.category.name}
                </span>
              )}
              {course.price !== null && course.price !== 0 && (
                <span className="text-lg font-fontUrbanist font-bold text-foreground">
                  {formatPrice(course.price)}
                </span>
              )}
              {(course.price === null || course.price === 0) && (
                <span className="text-lg font-fontUrbanist font-bold text-accent">
                  Free
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-fontUrbanist text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {course.title}
            </h1>

            {/* Author */}
            <p className="font-fontMontserrat text-lg text-muted-foreground">
              By{" "}
              <span className="font-semibold text-foreground">
                {course.author?.name}
              </span>
            </p>

            {/* CTA Button */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
              {course.canManage ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="rounded-lg bg-primary px-8 py-3 font-fontUrbanist text-base font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                  <Button
                    asChild
                    className="rounded-lg bg-primary px-8 py-3 font-fontUrbanist text-base font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Link
                      href={`/courses/${course.id}/chapters/${course.chapters[0]?.id}`}
                    >
                      View Chapters
                    </Link>
                  </Button>
                </div>
              ) : (
                <CourseEnrollButton
                  courseId={course.id}
                  price={course.price ?? undefined}
                  isPurchased={course.isPurchased}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-5xl space-y-12 px-6 py-16 lg:py-24">
        {/* Description Section */}
        {course.description && (
          <section className="space-y-6">
            <div className="border-l-4 border-accent pl-6">
              <h2 className="font-fontUrbanist text-3xl font-bold text-foreground">
                About This Course
              </h2>
            </div>
            <div className="prose prose-sm max-w-none rounded-xl bg-white p-8 font-fontMontserrat text-muted-foreground dark:bg-card/50">
              <RichTextPreview value={course.description} />
            </div>
          </section>
        )}

        {/* Course Content Section */}
        <section className="space-y-6">
          <div className="border-l-4 border-accent pl-6">
            <h2 className="font-fontUrbanist text-3xl font-bold text-foreground">
              Course Content
            </h2>
            <p className="mt-2 font-fontMontserrat text-muted-foreground">
              {course.totalChapters}{" "}
              {course.totalChapters === 1 ? "chapter" : "chapters"}
            </p>
          </div>

          {/* Chapters Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {course.chapters.map((chapter, index) => (
              <Link
                key={chapter.id}
                href={`/courses/${course.id}/chapters/${chapter.id}`}
              >
                <div
                  key={chapter.id}
                  className="group rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:border-accent hover:shadow-md dark:bg-card/50"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className="font-fontUrbanist text-2xl font-bold text-accent/40 group-hover:text-accent/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {chapter.isFree && (
                      <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-fontUrbanist font-semibold text-accent">
                        Free Preview
                      </span>
                    )}
                  </div>
                  <h3 className="font-fontUrbanist text-lg font-semibold text-foreground">
                    {chapter.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
