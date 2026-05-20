"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),

  description: z.string().optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trpc = useTRPC();

  const router = useRouter();

  const createCourse = useMutation(trpc.course.create.mutationOptions());

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),

    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: CourseFormValues) {
    setIsSubmitting(true);

    try {
      const data = await createCourse.mutateAsync({
        title: values.title,
        description: values.description ?? "",
      });

      toast.success("Course created");

      form.reset();

      router.push(`/dashboard/courses/${data.id}`);
    } catch (error) {
      toast.error("Failed to create course", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create a Course</h1>

        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to create a new course
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter course title"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>

                <FormDescription>The name of your course</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>

                <FormControl>
                  <Textarea
                    placeholder="Describe your course"
                    disabled={isSubmitting}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  A brief description of what the course covers
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
