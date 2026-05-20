"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Course } from "@/generated/prisma";

import { DynamicListEditor } from "./dynamic-list-editor";

type CourseObjective = {
  title: string;
  description: string;
};

const formSchema = z.object({
  objectives: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().optional(),
    })
  ),
});

export const ObjectivesForm = ({
  initialData,
  courseId,
}: {
  initialData: Course;
  courseId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // Ensure objectives is an array before mapping
  const objectivesData = initialData.objectives || [];
  const objectives = Array.isArray(objectivesData)
    ? objectivesData.map((item: any) => ({
        title: item?.title || "",
        description: item?.description || "",
      }))
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectives: objectives,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Objectives updated");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-md">
      <div className="flex justify-between items-center font-medium">
        Course Objectives
        <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
          {objectives.length > 0 ? (
            objectives.map((item, i) => (
              <li key={i}>
                <strong>{item.title}</strong>
                {item.description && <> — {item.description}</>}
              </li>
            ))
          ) : (
            <p className="italic">No objectives added.</p>
          )}
        </ul>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DynamicListEditor
                      value={
                        field.value as { title: string; description?: string }[]
                      }
                      onChange={field.onChange}
                      withDescription
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
