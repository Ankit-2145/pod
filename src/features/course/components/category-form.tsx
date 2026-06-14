"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  courseId: string;

  initialData: {
    categoryId: string | null;
  };
}

type CategoryFormValues = {
  categoryId: string;
};

export function CategoryForm({ courseId, initialData }: CategoryFormProps) {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { data: categories } = useSuspenseQuery(
    trpc.category.getActive.queryOptions(),
  );

  const updateCategory = useMutation(
    trpc.course.updateCategory.mutationOptions({
      onSuccess: async () => {
        toast.success("Category updated");

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

  const onUpdateCategory = async (values: CategoryFormValues) => {
    await updateCategory.mutateAsync({
      courseId,

      categoryId: values.categoryId,
    });
  };

  return (
    <Select
      defaultValue={initialData.categoryId ?? undefined}
      onValueChange={async (value) => {
        await onUpdateCategory({
          categoryId: value,
        });
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>

      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
