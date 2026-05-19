"use client";

import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

export default function CoursePage() {
  const trpc = useTRPC();

  const createCourse = useMutation(trpc.creation.mutationOptions());

  async function onSubmit() {
    try {
      const data = await createCourse.mutateAsync({
        title: "My Course",
      });

      toast.success("Course created", {
        description: `Course ID: ${data.id}`,
      });
    } catch (error) {
      toast.error("Failed to create course", {
        description: error.message,
      });
    }
  }

  return (
    <button onClick={onSubmit} disabled={createCourse.isPending}>
      {createCourse.isPending ? "Creating..." : "Create"}
    </button>
  );
}
