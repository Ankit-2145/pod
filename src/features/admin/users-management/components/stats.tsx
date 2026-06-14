"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  BookOpen,
  GraduationCap,
  Users,
  UserCog,
  FileText,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { StatsCard } from "./stats-card";

export function Stats() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.analytics.getAdminStats.queryOptions(),
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <StatsCard
        title="Total Users"
        value={data.totalUsers}
        description="Registered users"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />

      <StatsCard
        title="Total Instructors"
        value={data.totalInstructors}
        description="Instructor accounts"
        icon={<UserCog className="h-4 w-4 text-muted-foreground" />}
      />

      <StatsCard
        title="Total Courses"
        value={data.totalCourses}
        description="Courses created"
        icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
      />

      <StatsCard
        title="Published Courses"
        value={data.publishedCourses}
        description="Visible to students"
        icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
      />

      <StatsCard
        title="Draft Courses"
        value={data.draftCourses}
        description="Not yet published"
        icon={<FileText className="h-4 w-4 text-muted-foreground" />}
      />

      <StatsCard
        title="Enrollments"
        value={data.totalEnrollments}
        description="Total purchases"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
