"use client";

import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";

import { ConfirmModal } from "./confirm-modal";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export function Actions({ disabled, courseId, isPublished }: ActionsProps) {
  const router = useRouter();

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const publishCourse = useMutation(
    trpc.course.publish.mutationOptions({
      onSuccess: async () => {
        toast.success("Course published");

        await queryClient.invalidateQueries(
          trpc.course.getById.queryFilter({
            courseId,
          }),
        );

        await queryClient.invalidateQueries(trpc.course.getMany.queryFilter());
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const unpublishCourse = useMutation(
    trpc.course.unpublish.mutationOptions({
      onSuccess: async () => {
        toast.success("Course unpublished");

        await queryClient.invalidateQueries(
          trpc.course.getById.queryFilter({
            courseId,
          }),
        );

        await queryClient.invalidateQueries(trpc.course.getMany.queryFilter());
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const deleteCourse = useMutation(
    trpc.course.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Course deleted");

        await queryClient.invalidateQueries(trpc.course.getMany.queryFilter());

        router.push("/dashboard/courses");
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onTogglePublish = async () => {
    if (isPublished) {
      await unpublishCourse.mutateAsync({
        courseId,
      });

      return;
    }

    await publishCourse.mutateAsync({
      courseId,
    });
  };

  const onDelete = async () => {
    await deleteCourse.mutateAsync({
      courseId,
    });
  };

  const isPending =
    publishCourse.isPending ||
    unpublishCourse.isPending ||
    deleteCourse.isPending;

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
        <Button
          size="sm"
          variant="destructive"
          className="rounded-full border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-white"
          disabled={isPending}
        >
          Delete
        </Button>
      </ConfirmModal>
    </div>
  );
}
