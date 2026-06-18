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

type Props = {
  role: "user" | "instructor" | "admin" | "superAdmin";
};

export function DashboardCourses({ role }: Props) {
  const trpc = useTRPC();

  const { data: courses } = useSuspenseQuery(
    trpc.course.getDashboardCourses.queryOptions(),
  );

  // ===== USER =====
  if (role === "user" && courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No enrolled courses</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Purchase a course to start learning and access your dashboard.
          </p>

          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ===== INSTRUCTOR =====
  if (role === "instructor" && courses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No courses yet</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Create your first course and start publishing content.
          </p>

          <Button asChild>
            <Link href="/dashboard/courses/create">
              Create Your First Course
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ===== ADMIN =====
  if (role === "admin" || (role === "superAdmin" && courses.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            There are currently no courses in the system.
          </p>

          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/courses/create">Create Course</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/dashboard/users">Manage Users</Link>
            </Button>
          </div>
        </CardContent>
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
            <div className="line-clamp-4 text-sm text-muted-foreground">
              {course.description ? (
                <RichTextPreview value={course.description} />
              ) : (
                <p className="italic">No description</p>
              )}
            </div>

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

            <Button asChild className="w-full">
              <Link href={`/dashboard/courses/${course.id}`}>
                {role === "user" ? "Continue Learning" : "Manage Course"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
