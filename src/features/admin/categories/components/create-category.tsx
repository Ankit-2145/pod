"use client";

import { useState } from "react";
import z from "zod";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { Plus } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Category name is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCategory() {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      name: "",
    },
  });

  const createCategory = useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Category created");

        form.reset();

        setOpen(false);

        await queryClient.invalidateQueries(
          trpc.category.getMany.queryFilter(),
        );
      },

      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onCreateCategory = async (values: FormValues) => {
    await createCategory.mutateAsync(values);
  };

  const isPending = createCategory.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full" variant="outline">
          <Plus className="h-4 w-4" />
          Create category
        </Button>
      </DialogTrigger>

      <DialogContent className="font-fontUrbanist">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Create category
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            Categories help instructors organize their courses.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onCreateCategory)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-fontUrbanist text-sm font-medium text-foreground">
                    Category name
                  </FieldLabel>

                  <Input
                    {...field}
                    placeholder="e.g. Web Development"
                    disabled={isPending}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!form.formState.isValid || isPending}
              >
                Create
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
