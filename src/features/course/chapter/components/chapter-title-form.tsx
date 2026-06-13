"use client";

import * as z from "zod";

import { useState } from "react";

import { Pencil } from "lucide-react";

import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

const chapterTitleFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type ChapterTitleFormValues = z.infer<typeof chapterTitleFormSchema>;

export function ChapterTitleForm({
  initialData,
  chapterId,
}: ChapterTitleFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<ChapterTitleFormValues>({
    resolver: zodResolver(chapterTitleFormSchema),

    defaultValues: {
      title: initialData.title,
    },
  });

  const updateTitle = useMutation(
    trpc.chapter.updateTitle.mutationOptions({
      onSuccess: async () => {
        toast.success("Chapter title updated");

        await queryClient.invalidateQueries(
          trpc.chapter.getById.queryFilter({
            chapterId,
          }),
        );

        toggleEdit();
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onUpdateTitle = async (values: ChapterTitleFormValues) => {
    await updateTitle.mutateAsync({
      chapterId,

      title: values.title,
    });
  };

  const isPending = form.formState.isSubmitting || updateTitle.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Chapter title
        <Button type="button" variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit title
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="mt-2 text-sm text-muted-foreground">
          {initialData.title}
        </p>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onUpdateTitle)} className="mt-4">
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>

                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="e.g. Introduction to the course"
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
                Save
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </div>
  );
}
