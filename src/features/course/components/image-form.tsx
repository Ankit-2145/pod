"use client";

import Image from "next/image";

import { useState } from "react";

import { toast } from "sonner";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/shared/file-upload";
import { UploadedFile } from "@/types/upload";

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };

  courseId: string;
}

export function ImageForm({ initialData, courseId }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const updateImage = useMutation(
    trpc.course.updateImage.mutationOptions({
      onSuccess: async () => {
        toast.success("Course image updated");

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

  const onUpload = async (file: UploadedFile) => {
    await updateImage.mutateAsync({
      courseId,
      imageUrl: file.url,
      imageFileKey: file.key,
    });
  };

  const isPending = updateImage.isPending;

  return (
    <div className="mt-6 rounded-md border border-blue-100 p-2">
      <div className="flex items-center justify-between font-medium">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}

          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}

          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Course image"
              fill
              className="rounded-md object-cover"
              src={initialData.imageUrl}
            />
          </div>
        ))}

      {isEditing && (
        <div className="mt-4">
          <FileUpload endpoint="courseImage" onChange={onUpload} />

          <div className="mt-4 text-xs text-muted-foreground">
            16:9 aspect ratio recommended (up to 2MB)
          </div>

          {isPending && (
            <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>
          )}
        </div>
      )}
    </div>
  );
}
