"use client";

import * as z from "zod";

import { useState } from "react";

import { Pencil } from "lucide-react";

import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import ReactPlayer from "react-player";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface ChapterVideoFormProps {
  initialData: {
    videoUrl: string | null;
  };

  courseId: string;
  chapterId: string;
}

const chapterVideoFormSchema = z.object({
  videoUrl: z
    .string()
    .min(1, {
      message: "Video URL is required",
    })
    .url({
      message: "Please enter a valid URL",
    }),
});

type ChapterVideoFormValues = z.infer<typeof chapterVideoFormSchema>;

export function ChapterVideoForm({
  initialData,
  chapterId,
}: ChapterVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<ChapterVideoFormValues>({
    resolver: zodResolver(chapterVideoFormSchema),

    defaultValues: {
      videoUrl: initialData.videoUrl ?? "",
    },

    mode: "onChange",
  });

  const updateVideoUrl = useMutation(
    trpc.chapter.updateVideoUrl.mutationOptions({
      onSuccess: async () => {
        toast.success("Video URL updated");

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

  const onUpdateVideoUrl = async (values: ChapterVideoFormValues) => {
    await updateVideoUrl.mutateAsync({
      chapterId,
      videoUrl: values.videoUrl,
    });
  };

  const isPending = form.formState.isSubmitting || updateVideoUrl.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Chapter video URL
        <Button type="button" variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video URL
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {!initialData.videoUrl ? (
            <p className="text-sm italic text-muted-foreground">No video URL</p>
          ) : (
            <div className="space-y-4">
              <ReactPlayer
                src={initialData.videoUrl}
                width="100%"
                height="300px"
                controls
              />

              <p className="break-all text-xs text-muted-foreground">
                {initialData.videoUrl}
              </p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onUpdateVideoUrl)} className="mt-4">
          <FieldGroup>
            <Controller
              name="videoUrl"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Video URL</FieldLabel>

                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="https://www.youtube.com/watch?v=example"
                  />

                  <p className="mt-1 text-xs text-muted-foreground">
                    Paste a YouTube video URL
                  </p>

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
