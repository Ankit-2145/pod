"use client";

import Image from "next/image";
import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatPrice } from "@/lib/course/format";
import { RichTextPreview } from "./text-editor/rich-text-preview";
import { CourseEnrollButton } from "./enroll-button";

export function CoursesList() {
  const trpc = useTRPC();

  const { data: courses } = useSuspenseQuery(
    trpc.course.getPublished.queryOptions(),
  );

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No courses available</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="relative aspect-video w-full bg-muted">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>

          <CardHeader>
            <CardTitle className="line-clamp-2 text-lg">
              {course.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {course.category && (
              <p className="text-sm text-muted-foreground">
                {course.category.name}
              </p>
            )}

            <div className="line-clamp-4 text-sm text-muted-foreground">
              {course.description ? (
                <RichTextPreview value={course.description} />
              ) : (
                <p className="italic">No description</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>{course.chapters.length} chapters</span>

              {course.price && (
                <span className="font-semibold">
                  {formatPrice(course.price)}
                </span>
              )}
            </div>

            {course.canManage ? (
              <Button asChild className="w-full">
                <Link href={`/courses/${course.id}`}>View Course</Link>
              </Button>
            ) : (
              <CourseEnrollButton
                courseId={course.id}
                price={course.price ?? undefined}
                isPurchased={course.isPurchased}
              />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
