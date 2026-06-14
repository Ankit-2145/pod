"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmModal } from "@/features/course/components/confirm-modal";

interface Props {
  categoryId: string;
  courseCount: number;
  onSuccess?: () => void;
}

export function DeleteCategory({ categoryId, courseCount, onSuccess }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const onDeleteCategory = useMutation(
    trpc.category.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Category deleted");

        await queryClient.invalidateQueries(
          trpc.category.getMany.queryFilter(),
        );

        onSuccess?.();
      },
    }),
  );

  const disabled = courseCount > 0;

  const button = (
    <Button
      variant="destructive"
      disabled={disabled || onDeleteCategory.isPending}
    >
      Delete category
    </Button>
  );

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-destructive/20">
        <div className="flex-1">
          <h4 className="text-base font-semibold text-destructive">
            Delete Category
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Permanently remove this category from your system
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md bg-white/50 dark:bg-black/20 p-4 border border-destructive/20">
        <p className="text-sm font-medium text-foreground mb-2">
          Before you delete:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• This action cannot be undone</li>
          <li>
            •{" "}
            {disabled
              ? `This category has ${courseCount} assigned course${courseCount !== 1 ? "s" : ""} and cannot be deleted`
              : "The category will be permanently removed"}
          </li>
        </ul>
      </div>

      <div className="mt-6">
        {disabled ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{button}</div>
            </TooltipTrigger>

            <TooltipContent side="top" className="text-center">
              <p className="font-medium">Cannot Delete</p>
              <p className="text-xs mt-1">
                This category is assigned to {courseCount} course
                {courseCount !== 1 ? "s" : ""}. Remove courses first.
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <ConfirmModal
            onConfirm={() =>
              onDeleteCategory.mutateAsync({
                categoryId,
              })
            }
          >
            {button}
          </ConfirmModal>
        )}
      </div>
    </div>
  );
}
