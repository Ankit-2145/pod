"use client";

import { Upload } from "lucide-react";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      appearance={{
        button:
          "ut-ready:cursor-pointer ut-ready:bg-brand ut-uploading:cursor-not-allowed ut-uploading:bg-brand/80 rounded-md after:bg-brand/60",
        container: "border border-dashed rounded-lg p-4 bg-bg-highlight",
        uploadIcon: "text-brand",
        label: "text-gray-600 hover:text-brand",
      }}
      content={{
        uploadIcon: () => <Upload />,
        button: "Upload",
      }}
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (!res?.[0]) return;

        onChange(res[0].url);
      }}
      onUploadError={() => {
        toast.error("Error uploading file. Please try again.");
      }}
    />
  );
};
