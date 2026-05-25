"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { LayoutDashboard } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TitleForm } from "./title-form";
import { ShortDescriptionForm } from "./short-description-form";
import { DescriptionForm } from "./description-form";
import { ImageForm } from "./image-form";
import { CategoryForm } from "./category-form";
import { PriceForm } from "./price-form";

interface EditorProps {
  courseId: string;
}

export function Editor({ courseId }: EditorProps) {
  const trpc = useTRPC();

  const { data: course } = useSuspenseQuery(
    trpc.course.getById.queryOptions({
      courseId,
    }),
  );

  const requiredFields = [course.title, course.shortDescription];

  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <main className="flex-1">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Course setup</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Complete all fields {completionText}
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1">
          <Card className="gap-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />

                <CardTitle>Title</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <TitleForm initialData={course} courseId={courseId} />
            </CardContent>
          </Card>

          <Card className="gap-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />

                <CardTitle>Short Description</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ShortDescriptionForm initialData={course} courseId={courseId} />
            </CardContent>
          </Card>

          <Card className="gap-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />

                <CardTitle>Description</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <DescriptionForm initialData={course} courseId={courseId} />
            </CardContent>
          </Card>

          <Card className="gap-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />

                <CardTitle>Image</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ImageForm initialData={course} courseId={courseId} />
            </CardContent>
          </Card>

          <Card className="gap-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />

                <CardTitle>Category</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <CategoryForm initialData={course} courseId={courseId} />
            </CardContent>
          </Card>

          <Card className="gap-0">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />

                <CardTitle>Price</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <PriceForm initialData={course} courseId={courseId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
