"use client";

import * as z from "zod";

import { useState } from "react";

import { Pencil } from "lucide-react";

import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };

  courseId: string;

  chapterId: string;
}

const chapterAccessFormSchema = z.object({
  isFree: z.boolean(),
});

type ChapterAccessFormValues = z.infer<typeof chapterAccessFormSchema>;

export function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<ChapterAccessFormValues>({
    resolver: zodResolver(chapterAccessFormSchema),

    defaultValues: {
      isFree: initialData.isFree,
    },
  });

  const updateAccess = useMutation(
    trpc.chapter.updateAccess.mutationOptions({
      onSuccess: async () => {
        toast.success("Chapter access updated");

        await queryClient.invalidateQueries(
          trpc.chapter.getById.queryFilter({
            courseId,
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

  const onUpdateAccess = async (values: ChapterAccessFormValues) => {
    await updateAccess.mutateAsync({
      chapterId,

      isFree: values.isFree,
    });
  };

  const isPending = form.formState.isSubmitting || updateAccess.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Chapter access
        <Button type="button" onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.isFree && "italic text-slate-500",
          )}
        >
          {initialData.isFree ? (
            <span className="text-muted-foreground">
              This chapter is free for preview
            </span>
          ) : (
            "This chapter is not free"
          )}
        </p>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onUpdateAccess)} className="mt-4">
          <FieldGroup>
            <Controller
              name="isFree"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-start space-x-3 rounded-md border border-blue-100 p-4">
                    <Checkbox
                      id="free-chapter-preview"
                      checked={field.value}
                      disabled={isPending}
                      onCheckedChange={(checked) =>
                        field.onChange(Boolean(checked))
                      }
                    />

                    <div className="space-y-1">
                      <FieldLabel htmlFor="free-chapter-preview">
                        Free chapter preview
                      </FieldLabel>

                      <p className="text-sm text-muted-foreground">
                        Allow students to preview this chapter without
                        purchasing the course.
                      </p>
                    </div>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button type="submit" disabled={isPending}>
                Save
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </div>
  );
}
