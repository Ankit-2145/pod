"use client";

import * as z from "zod";

import { useState } from "react";

import { Loader2, Plus } from "lucide-react";

import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { ChaptersList } from "./chapter-list";

interface Chapter {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
}

interface ChaptersFormProps {
  initialData: {
    chapters: Chapter[];
  };

  courseId: string;
}

const createChapterSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type CreateChapterValues = z.infer<typeof createChapterSchema>;

export function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => setIsCreating((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<CreateChapterValues>({
    resolver: zodResolver(createChapterSchema),

    defaultValues: {
      title: "",
    },

    mode: "onChange",
  });

  const createChapter = useMutation(
    trpc.chapter.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Chapter created");

        form.reset();

        toggleCreating();

        await queryClient.invalidateQueries(
          trpc.course.getById.queryFilter({
            courseId,
          }),
        );
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const reorderChapters = useMutation(
    trpc.chapter.reorder.mutationOptions({
      onSuccess: async () => {
        toast.success("Chapters reordered");

        await queryClient.invalidateQueries(
          trpc.course.getById.queryFilter({
            courseId,
          }),
        );
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onCreateChapter = async (values: CreateChapterValues) => {
    await createChapter.mutateAsync({
      courseId,

      title: values.title,
    });
  };

  const onReorder = async (
    updateData: {
      id: string;
      position: number;
    }[],
  ) => {
    await reorderChapters.mutateAsync({
      courseId,

      list: updateData,
    });
  };

  const onEdit = (id: string) => {
    window.location.href = `/dashboard/courses/${courseId}/chapters/${id}`;
  };

  const isPending = createChapter.isPending || reorderChapters.isPending;

  return (
    <div className="relative mt-6 rounded-md border border-blue-100 p-2">
      {reorderChapters.isPending && (
        <div className="absolute top-0 right-0 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost" type="button">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <form
          onSubmit={form.handleSubmit(onCreateChapter)}
          className="mt-4 space-y-4"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Chapter title</FieldLabel>

                  <Input
                    {...field}
                    placeholder="e.g. Introduction to the course"
                    disabled={isPending}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isPending}
              >
                Create
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",

            !initialData.chapters.length && "italic text-slate-500",
          )}
        >
          {!initialData.chapters.length && "No chapters"}

          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters}
          />
        </div>
      )}

      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
}
