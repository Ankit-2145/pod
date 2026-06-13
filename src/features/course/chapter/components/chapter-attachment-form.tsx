"use client";

import { useState } from "react";

import Link from "next/link";

import { toast } from "sonner";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { File, Loader2, PlusCircle, Trash } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/file-upload";
import { Attachment } from "@/generated/prisma/browser";

interface ChapterAttachmentsFormProps {
  initialData: {
    attachments: Attachment[];
  };

  courseId: string;
  chapterId: string;
}

export function ChapterAttachmentsForm({
  initialData,

  chapterId,
}: ChapterAttachmentsFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const createAttachment = useMutation(
    trpc.chapter.createAttachment.mutationOptions({
      onSuccess: async () => {
        toast.success("Attachment uploaded");

        await queryClient.invalidateQueries(
          trpc.chapter.getById.queryFilter({
            chapterId,
          }),
        );

        toggleEdit();
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const deleteAttachment = useMutation(
    trpc.chapter.deleteAttachment.mutationOptions({
      onSuccess: async () => {
        toast.success("Attachment deleted");

        await queryClient.invalidateQueries(
          trpc.chapter.getById.queryFilter({
            chapterId,
          }),
        );
      },

      onError: (error) => {
        toast.error(error.message);
      },

      onSettled: () => {
        setDeletingId(null);
      },
    }),
  );

  const onDelete = async (attachmentId: string) => {
    setDeletingId(attachmentId);

    await deleteAttachment.mutateAsync({
      attachmentId,
    });
  };

  const sanitizeName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
  };

  const isPending = createAttachment.isPending || deleteAttachment.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Chapter Attachments
        <Button
          type="button"
          variant="ghost"
          onClick={toggleEdit}
          disabled={isPending}
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a file
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="mt-2 text-sm italic text-muted-foreground">
              No attachments yet
            </p>
          )}

          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center rounded-md border border-blue-100 p-3 text-brand"
                >
                  <File className="mr-2 h-4 w-4 shrink-0" />

                  <Link
                    href={attachment.url}
                    target="_blank"
                    className="min-w-0"
                  >
                    <p className="line-clamp-1 text-xs hover:underline">
                      {attachment.name}
                    </p>
                  </Link>

                  {deletingId === attachment.id ? (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto transition hover:opacity-75"
                    >
                      <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endpoint="courseAttachment"
            onChange={async (file) => {
              await createAttachment.mutateAsync({
                chapterId,
                url: file.url,
                name: sanitizeName(file.name),
                fileKey: file.key,
              });
            }}
          />

          <p className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course
          </p>
        </div>
      )}
    </div>
  );
}
