"use client";

import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

import { useTRPC } from "@/trpc/client";

const createCourseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type CreateCourseValues = z.infer<typeof createCourseSchema>;

export function CreateCourseForm() {
  const router = useRouter();
  const trpc = useTRPC();

  const form = useForm<CreateCourseValues>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  const createCourse = useMutation(
    trpc.course.create.mutationOptions({
      onSuccess: (course) => {
        toast.success("Course created");

        router.push(`/dashboard/courses/${course.id}`);
      },

      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  const onCreateCourse = async (values: CreateCourseValues) => {
    await createCourse.mutateAsync(values);
  };

  const isPending = form.formState.isSubmitting || createCourse.isPending;

  return (
    <FieldSet className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-bold">Create Course</h1>

        <FieldDescription>
          Please enter the title of your course to get started. You can always
          edit this later.
        </FieldDescription>
      </div>

      <form
        id="create-course-form"
        onSubmit={form.handleSubmit(onCreateCourse)}
      >
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>

                <Input
                  {...field}
                  id="title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Course Title"
                  type="text"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button type="submit" className="w-full" disabled={isPending}>
              Create Course
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Already have a course?{" "}
        <Link href="/dashboard/courses">View courses</Link>
      </FieldDescription>
    </FieldSet>
  );
}
