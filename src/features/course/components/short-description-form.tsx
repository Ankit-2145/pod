"use client";

import * as z from "zod";

import { Pencil } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface ShortDescriptionFormProps {
  initialData: {
    shortDescription: string | null;
  };

  courseId: string;
}

const shortDescriptionFormSchema = z.object({
  shortDescription: z
    .string()
    .min(1, {
      message: "Short description is required",
    })
    .max(200, {
      message: "Short description must be at most 200 characters",
    }),
});

type ShortDescriptionFormValues = z.infer<typeof shortDescriptionFormSchema>;

export function ShortDescriptionForm({
  initialData,
  courseId,
}: ShortDescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<ShortDescriptionFormValues>({
    resolver: zodResolver(shortDescriptionFormSchema),

    defaultValues: {
      shortDescription: initialData.shortDescription || "",
    },
  });

  const updateShortDescription = useMutation(
    trpc.course.updateShortDescription.mutationOptions({
      onSuccess: async () => {
        toast.success("Course short description updated");

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

  const onUpdateShortDescription = async (
    values: ShortDescriptionFormValues,
  ) => {
    await updateShortDescription.mutateAsync({
      courseId,

      shortDescription: values.shortDescription,
    });
  };

  const isPending =
    !form.formState.isValid ||
    form.formState.isSubmitting ||
    updateShortDescription.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Course short description
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
        <p
          className={cn(
            "mt-2 text-sm text-gray-600",

            !initialData.shortDescription && "italic text-slate-500",
          )}
        >
          {initialData.shortDescription || "No short description"}
        </p>
      )}

      {isEditing && (
        <form
          id="course-short-description-form"
          onSubmit={form.handleSubmit(onUpdateShortDescription)}
          className="mt-4 space-y-4"
        >
          <FieldGroup>
            <Controller
              name="shortDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Short description
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id="shortDescription"
                    aria-invalid={fieldState.invalid}
                    disabled={isPending}
                    placeholder="e.g. Best for UG/PG students"
                  />

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
