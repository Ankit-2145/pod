"use client";

import { z } from "zod";

import { toast } from "sonner";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

const createCategorySchema = z.object({
  name: z.string().min(1),
});

type CreateCategoryValues = z.infer<typeof createCategorySchema>;

export function CreateCategoryForm() {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<CreateCategoryValues>({
    resolver: zodResolver(createCategorySchema),

    defaultValues: {
      name: "",
    },
  });

  const createCategory = useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Category created");

        form.reset();

        await queryClient.invalidateQueries(
          trpc.category.getMany.queryFilter(),
        );
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onSubmit = async (values: CreateCategoryValues) => {
    await createCategory.mutateAsync(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
      <Controller
        name="name"
        control={form.control}
        render={({ field }) => <Input placeholder="Category name" {...field} />}
      />

      <Button type="submit" disabled={createCategory.isPending}>
        Create
      </Button>
    </form>
  );
}
