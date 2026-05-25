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

import { formatPrice } from "@/lib/course/format";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

interface PriceFormProps {
  initialData: {
    price: number | null;
    originalPrice: number | null;
  };

  courseId: string;
}

const priceFormSchema = z
  .object({
    originalPrice: z.coerce
      .number()
      .min(0, {
        message: "Original price must be at least 0",
      })
      .nullable(),

    price: z.coerce
      .number()
      .min(0, {
        message: "Discount price must be at least 0",
      })
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.price !== null && data.originalPrice !== null) {
        return data.price <= data.originalPrice;
      }

      return true;
    },
    {
      message: "Discount price cannot be greater than original price",

      path: ["price"],
    },
  );

type PriceFormValues = z.infer<typeof priceFormSchema>;

export function PriceForm({ initialData, courseId }: PriceFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),

    defaultValues: {
      originalPrice: initialData.originalPrice ?? null,

      price: initialData.price ?? null,
    },
  });

  const updatePrice = useMutation(
    trpc.course.updatePrice.mutationOptions({
      onSuccess: async () => {
        toast.success("Course pricing updated");

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

  const onUpdatePrice = async (values: PriceFormValues) => {
    await updatePrice.mutateAsync({
      courseId,

      originalPrice: values.originalPrice,

      price: values.price,
    });
  };

  const isPending =
    form.formState.isSubmitting ||
    !form.formState.isValid ||
    updatePrice.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Course pricing
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit pricing
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4 space-y-2">
          <div>
            <p className="text-sm font-medium">Original price</p>

            <p
              className={cn(
                "text-sm text-muted-foreground",

                !initialData.originalPrice && "italic",
              )}
            >
              {initialData.originalPrice
                ? formatPrice(initialData.originalPrice)
                : "No original price"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">Discount price</p>

            <p
              className={cn(
                "text-sm text-muted-foreground",

                !initialData.price && "italic",
              )}
            >
              {initialData.price
                ? formatPrice(initialData.price)
                : "No discount price"}
            </p>
          </div>
        </div>
      )}

      {isEditing && (
        <form
          id="course-price-form"
          onSubmit={form.handleSubmit(onUpdatePrice)}
          className="mt-4 space-y-4"
        >
          <FieldGroup>
            <Controller
              name="originalPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Original price</FieldLabel>

                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    step="0.01"
                    placeholder="999"
                    disabled={isPending}
                    onChange={(e) => {
                      const value = e.target.value;

                      field.onChange(value === "" ? null : Number(value));
                    }}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Discount price</FieldLabel>

                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="number"
                    step="0.01"
                    placeholder="499"
                    disabled={isPending}
                    onChange={(e) => {
                      const value = e.target.value;

                      field.onChange(value === "" ? null : Number(value));
                    }}
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
