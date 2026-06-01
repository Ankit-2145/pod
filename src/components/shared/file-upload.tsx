"use client";

import { Upload } from "lucide-react";
import { toast } from "sonner";

import { UploadDropzone } from "@/lib/uploadthing/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import type { UploadedFile } from "@/types/upload";

interface FileUploadProps {
  onChange: (file: UploadedFile) => void;
  endpoint: keyof typeof ourFileRouter;
}

export function FileUpload({ onChange, endpoint }: FileUploadProps) {
  return (
    <UploadDropzone
      endpoint={endpoint}
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
      onClientUploadComplete={(res) => {
        if (!res?.[0]) return;

        onChange({
          url: res[0].ufsUrl,
          key: res[0].key,
          name: res[0].name,
        });
      }}
      onUploadError={() => {
        toast.error("Error uploading file");
      }}
    />
  );
}
