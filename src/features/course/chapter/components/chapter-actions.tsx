"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "../../components/confirm-modal";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) {
  const router = useRouter();

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const publishChapter = useMutation(
    trpc.chapter.publish.mutationOptions({
      onSuccess: async () => {
        toast.success("Chapter published");

        await Promise.all([
          queryClient.invalidateQueries(
            trpc.chapter.getById.queryFilter({
              chapterId,
            }),
          ),

          queryClient.invalidateQueries(
            trpc.course.getById.queryFilter({
              courseId,
            }),
          ),
        ]);
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const unpublishChapter = useMutation(
    trpc.chapter.unpublish.mutationOptions({
      onSuccess: async () => {
        toast.success("Chapter unpublished");

        await Promise.all([
          queryClient.invalidateQueries(
            trpc.chapter.getById.queryFilter({
              chapterId,
            }),
          ),

          queryClient.invalidateQueries(
            trpc.course.getById.queryFilter({
              courseId,
            }),
          ),
        ]);
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const deleteChapter = useMutation(
    trpc.chapter.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Chapter deleted");

        await queryClient.invalidateQueries(
          trpc.course.getById.queryFilter({
            courseId,
          }),
        );

        router.push(`/dashboard/courses/${courseId}`);
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onTogglePublish = async () => {
    if (isPublished) {
      await unpublishChapter.mutateAsync({
        chapterId,
      });

      return;
    }

    await publishChapter.mutateAsync({
      chapterId,
    });
  };

  const onDelete = async () => {
    await deleteChapter.mutateAsync({
      chapterId,
    });
  };

  const isPending =
    publishChapter.isPending ||
    unpublishChapter.isPending ||
    deleteChapter.isPending;

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onTogglePublish}
        disabled={disabled || isPending}
        size="sm"
        className="rounded-full"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>

      <ConfirmModal onConfirm={onDelete}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isPending || isPublished}
                  className="rounded-full border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-white"
                >
                  Delete
                </Button>
              </span>
            </TooltipTrigger>

            {isPublished && (
              <TooltipContent>
                <p>Unpublish the chapter before deleting it</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </ConfirmModal>
    </div>
  );
}
