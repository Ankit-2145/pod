"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { useState } from "react";

import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface TitleFormProps {
  initialData: {
    title: string;
  };

  courseId: string;
}

const titleFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

type TitleFormValues = z.infer<typeof titleFormSchema>;

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<TitleFormValues>({
    resolver: zodResolver(titleFormSchema),

    defaultValues: initialData,
  });

  const updateTitle = useMutation(
    trpc.course.updateTitle.mutationOptions({
      onSuccess: async () => {
        toast.success("Course title updated");

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

  const onUpdateTitle = async (values: TitleFormValues) => {
    await updateTitle.mutateAsync({
      courseId,

      title: values.title,
    });
  };

  const isPending =
    !form.formState.isValid ||
    form.formState.isSubmitting ||
    updateTitle.isPending;

  return (
    <div className="mt-4 rounded-xl border border-slate-200 p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-slate-900">Course title</h3>
        <Button
          onClick={toggleEdit}
          variant="ghost"
          className="text-slate-600 hover:text-slate-900"
        >
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
        <p className="mt-4 text-base text-slate-700">{initialData.title}</p>
      )}

      {isEditing && (
        <form
          id="course-title-form"
          onSubmit={form.handleSubmit(onUpdateTitle)}
          className="mt-6 space-y-5"
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-medium text-slate-700"
                  >
                    Title
                  </FieldLabel>

                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter course title"
                    type="text"
                    className="mt-2"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={isPending}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={toggleEdit}
              >
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      )}
    </div>
  );
};
