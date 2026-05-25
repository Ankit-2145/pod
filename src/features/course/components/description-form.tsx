"use client";

import * as z from "zod";

import { Pencil } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { RichTextEditor } from "../text-editor/rich-text-editor";
import { RichTextPreview } from "../text-editor/rich-text-preview";

interface DescriptionFormProps {
  initialData: {
    description: string | null;
  };

  courseId: string;
}

const descriptionFormSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

type DescriptionFormValues = z.infer<typeof descriptionFormSchema>;

export function DescriptionForm({
  initialData,
  courseId,
}: DescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<DescriptionFormValues>({
    resolver: zodResolver(descriptionFormSchema),

    defaultValues: {
      description: initialData.description || "",
    },
  });

  const updateDescription = useMutation(
    trpc.course.updateDescription.mutationOptions({
      onSuccess: async () => {
        toast.success("Course description updated");

        await queryClient.invalidateQueries(
          trpc.course.getById.queryFilter({
            courseId,
          }),
        );

        toggleEdit();
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onUpdateDescription = async (values: DescriptionFormValues) => {
    await updateDescription.mutateAsync({
      courseId,

      description: values.description,
    });
  };

  const isPending =
    !form.formState.isValid ||
    form.formState.isSubmitting ||
    updateDescription.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Course description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit description
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          className={cn(
            "mt-2 text-sm text-gray-600",

            !initialData.description && "italic text-slate-500",
          )}
        >
          {!initialData.description && "No description"}

          {initialData.description && (
            <RichTextPreview value={initialData.description} />
          )}
        </div>
      )}

      {isEditing && (
        <form
          id="course-description-form"
          onSubmit={form.handleSubmit(onUpdateDescription)}
          className="mt-4 space-y-4"
        >
          <FieldGroup>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <RichTextEditor field={field} />

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
