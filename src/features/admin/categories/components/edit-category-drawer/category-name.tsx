"use client";

import { useState } from "react";
import z from "zod";

import { Pencil } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface Props {
  categoryId: string;

  initialData: {
    name: string;
  };

  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Category name is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CategoryName({ categoryId, initialData, onSuccess }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: initialData,
  });

  const updateCategory = useMutation(
    trpc.category.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Category updated");

        setIsEditing(false);

        await queryClient.invalidateQueries(
          trpc.category.getMany.queryFilter(),
        );

        onSuccess?.();
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onUpdateCategory = async (values: FormValues) => {
    await updateCategory.mutateAsync({
      categoryId,
      name: values.name,
    });
  };

  const isPending = updateCategory.isPending || form.formState.isSubmitting;

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-foreground">
            Category Name
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            The name displayed throughout the platform
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleEdit}
            className="gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      {!isEditing && (
        <div className="mt-4 rounded-md bg-muted/40 p-4 border border-muted">
          <p className="text-base font-medium text-foreground">
            {initialData.name}
          </p>
        </div>
      )}

      {isEditing && (
        <form onSubmit={form.handleSubmit(onUpdateCategory)} className="mt-6">
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category Name</FieldLabel>

                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="Enter category name"
                    autoFocus
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isPending}
                size="sm"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleEdit}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      )}
    </div>
  );
}
