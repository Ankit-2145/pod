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

export function DashboardCourses() {
  const trpc = useTRPC();

  const { data: courses } = useSuspenseQuery(
    trpc.course.getDashboardCourses.queryOptions(),
  );

  if (courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No courses yet</CardTitle>
        </CardHeader>

        <CardContent>
          <Button asChild>
            <Link href="/dashboard/courses/create">
              Create your first course
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        // Fixed: Removed the empty <> fragment. The key is now correctly on the Card.
        <Card key={course.id} className="overflow-hidden">
          {/* IMAGE */}

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
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-2 text-lg">
                {course.title}
              </CardTitle>

              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  course.isPublished
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* DESCRIPTION */}

            <div className="line-clamp-4 text-sm text-muted-foreground">
              {course.description ? (
                <RichTextPreview value={course.description} />
              ) : (
                <p className="italic">No description</p>
              )}
            </div>

            {/* PRICING */}

            <div className="space-y-1 text-sm">
              {course.originalPrice && (
                <div className="text-muted-foreground line-through">
                  {formatPrice(course.originalPrice)}
                </div>
              )}

              {course.price && (
                <div className="font-semibold">{formatPrice(course.price)}</div>
              )}
            </div>

            {/* ACTION */}

            <Button asChild className="w-full">
              <Link href={`/dashboard/courses/${course.id}`}>
                Manage Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
