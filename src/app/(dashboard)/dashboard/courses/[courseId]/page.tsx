import { redirect } from "next/navigation";

import prisma from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/auth-check";
import { TitleForm } from "@/features/course/components/title-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

const CourseIdPage = async ({ params }: PageProps) => {
  const session = await requireAuth();

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    redirect("/dashboard/courses");
  }

  const isOwner = course.authorId === session.user.id;

  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    redirect("/dashboard/courses");
  }

  const requiredFields = [course.title];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <main className="flex-1">
      {/* {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to students." />
      )} */}

      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold">Course setup</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete all fields {completionText}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Customize Course Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                <CardTitle>Customize your course</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <TitleForm initialData={course} courseId={courseId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CourseIdPage;
