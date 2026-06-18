"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { RichTextPreview } from "../../text-editor/rich-text-preview";
import { CourseEnrollButton } from "../../enroll-button";
import { formatPrice } from "@/lib/course/format";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Star } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-background via-background to-accent/5">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-0 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-12 lg:py-20">
          {/* Course Image */}
          {course.imageUrl && (
            <div className="mb-12 overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative aspect-video w-full">
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full object-cover"
                  fill
                  priority
                />
              </div>
            </div>
          )}

          {/* Course Header */}
          <div className="space-y-8">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3">
              {course.category && (
                <Badge
                  variant="secondary"
                  className="bg-accent text-foreground hover:bg-accent/20 font-heading font-semibold text-sm px-4 py-1.5"
                >
                  {course.category.name}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-sm font-fontMontserrat text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>
                  {course.totalChapters}{" "}
                  {course.totalChapters === 1 ? "chapter" : "chapters"}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-5xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl">
              {course.title}
            </h1>

            {/* Author and Price */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-fontMontserrat text-lg text-muted-foreground">
                By{" "}
                <span className="font-semibold text-foreground">
                  {course.author?.name}
                </span>
              </p>
              {course.price !== null && course.price !== 0 ? (
                <div className="inline-flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-bold text-foreground">
                    {formatPrice(course.price)}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-accent/30 bg-accent/5 text-accent px-4 py-1.5"
                  >
                    Free Course
                  </Badge>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col pt-4 sm:flex-row sm:items-center gap-4">
              {course.canManage ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="rounded-xl bg-primary px-8 py-3 font-heading text-base font-semibold text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                  >
                    <Link href={`/dashboard/courses/${course.id}`}>
                      Manage Course
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl px-8 py-3 font-heading text-base font-semibold border-primary/30 hover:border-primary/60 transition-all duration-200"
                  >
                    <Link
                      href={`/courses/${course.id}/chapters/${course.chapters[0]?.id}`}
                    >
                      Start Learning
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
      <div className="mx-auto max-w-6xl space-y-16 px-6 py-16 lg:py-24">
        {/* Description Section */}
        {course.description && (
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-1 w-12 rounded-full bg-accent" />
              <h2 className="font-heading text-3xl font-bold text-foreground">
                About This Course
              </h2>
            </div>
            <div className="prose prose-sm max-w-none rounded-2xl border border-border/50 bg-card p-8 font-fontMontserrat text-muted-foreground shadow-sm dark:prose-invert">
              <RichTextPreview value={course.description} />
            </div>
          </section>
        )}

        {/* Course Content Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 rounded-full bg-accent" />
            <h2 className="font-heading text-3xl font-bold text-foreground">
              Course Content
            </h2>
          </div>

          {/* Chapters Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {course.chapters.map((chapter, index) => (
              <Link
                key={chapter.id}
                href={`/courses/${course.id}/chapters/${chapter.id}`}
              >
                <div className="group h-full rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/50 hover:bg-card hover:shadow-lg hover:shadow-accent/10">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="font-heading text-4xl font-bold bg-linear-to-br from-accent to-primary bg-clip-text text-transparent group-hover:from-accent group-hover:to-primary/80 transition-all duration-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {chapter.isFree && (
                      <Badge
                        variant="outline"
                        className="border-accent/30 bg-accent/10 text-accent text-xs font-heading font-semibold"
                      >
                        Free
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-200">
                    {chapter.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground font-fontMontserrat">
                    Chapter {index + 1}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="rounded-2xl border border-border/50 bg-card/50 p-8 backdrop-blur-sm">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <BookOpen className="h-5 w-5" />
                <span className="font-fontMontserrat text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Total Chapters
                </span>
              </div>
              <p className="font-heading text-3xl font-bold text-foreground">
                {course.totalChapters}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Star className="h-5 w-5" />
                <span className="font-fontMontserrat text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Course Level
                </span>
              </div>
              <p className="font-heading text-3xl font-bold text-foreground capitalize">
                {course.category?.name || "All Levels"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <Users className="h-5 w-5" />
                <span className="font-fontMontserrat text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Taught By
                </span>
              </div>
              <p className="font-heading text-3xl font-bold text-foreground">
                {course.author?.name || "Expert"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
