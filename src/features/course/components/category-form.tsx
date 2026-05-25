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

interface Props {
  courseId: string;

  initialData: {
    categoryId: string | null;
  };
}

export function CategoryForm({ courseId, initialData }: Props) {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { data: categories } = useSuspenseQuery(
    trpc.category.getMany.queryOptions(),
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
    }),
  );

  //   Add onupdate Category function for form

  return (
    <Select
      defaultValue={initialData.categoryId || undefined}
      onValueChange={async (value) => {
        await updateCategory.mutateAsync({
          courseId,
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
