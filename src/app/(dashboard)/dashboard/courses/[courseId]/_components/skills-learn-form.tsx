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
import { Course } from "@/generated/prisma";

import { DynamicListEditor } from "./dynamic-list-editor";

type skillsLearned = {
  title: string;
};

const formSchema = z.object({
  skillsLearned: z.array(
    z.object({
      title: z.string().min(1),
    })
  ),
});

export const SkillsLearnedForm = ({
  initialData,
  courseId,
}: {
  initialData: Course;
  courseId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const skillsLearned = (
    (initialData.skillsLearned ?? []) as skillsLearned[]
  ).map((item) => ({
    title: item?.title || "",
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillsLearned: skillsLearned,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("What you'll learn updated");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="mt-6 border p-4 rounded-md">
      <div className="flex justify-between items-center font-medium">
        Course skills learn
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
          {skillsLearned?.map((item, i) => (
            <li key={i}>
              <p>{item.title}</p>
            </li>
          ))}
          {skillsLearned.length === 0 && (
            <p className="italic">No items added.</p>
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
              name="skillsLearned"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DynamicListEditor
                      value={field.value as { title: string }[]}
                      onChange={field.onChange}
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
