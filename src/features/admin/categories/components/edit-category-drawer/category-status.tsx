"use client";

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface Props {
  categoryId: string;
  isActive: boolean;
  onSuccess?: () => void;
}

export function CategoryStatus({ categoryId, isActive, onSuccess }: Props) {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const activeCategory = useMutation(
    trpc.category.inActive.mutationOptions({
      onSuccess: async () => {
        toast.success("Category Inactivated");

        await queryClient.invalidateQueries(
          trpc.category.getMany.queryFilter(),
        );

        onSuccess?.();
      },
    }),
  );

  const inActiveCategory = useMutation(
    trpc.category.Active.mutationOptions({
      onSuccess: async () => {
        toast.success("Category Activated");

        await queryClient.invalidateQueries(
          trpc.category.getMany.queryFilter(),
        );

        onSuccess?.();
      },
    }),
  );

  const onToggle = async (checked: boolean) => {
    if (checked) {
      await inActiveCategory.mutateAsync({
        categoryId,
      });

      return;
    }

    await activeCategory.mutateAsync({
      categoryId,
    });
  };

  const isPending = activeCategory.isPending || inActiveCategory.isPending;

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-foreground">
            Category Status
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Control whether instructors can assign this category to courses
          </p>
        </div>

        <Badge
          variant={isActive ? "default" : "outline"}
          className="rounded-full gap-2"
        >
          <span
            className={`h-2 w-2 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`}
          />
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-md border bg-muted/30 px-4 py-3">
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {isActive ? "Category is Active" : "Category is Inactive"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isActive
              ? "Instructors can assign courses to this category"
              : "Instructors cannot assign courses to this category"}
          </p>
        </div>

        <Switch
          checked={isActive}
          onCheckedChange={onToggle}
          disabled={isPending}
          className="ml-4"
        />
      </div>
    </div>
  );
}
