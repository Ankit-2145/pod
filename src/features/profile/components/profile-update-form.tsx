"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Please enter a valid email address"),
});

type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

export function ProfileUpdateForm({
  user,
}: {
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const form = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  const onProfileUpdate = async (values: ProfileUpdateFormValues) => {
    const promises = [
      authClient.updateUser({
        name: values.name,
      }),
    ];

    if (values.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: values.email,
          callbackURL: "/profile",
        }),
      );
    }

    const res = await Promise.all(promises);

    const updateUserResult = res[0];
    const emailResult = res[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || "Failed to update profile");
    } else if (emailResult.error) {
      toast.error(emailResult.error.message || "Failed to change email");
    } else {
      if (values.email !== user.email) {
        toast.success("Verify your new email address to complete the change.");
      } else {
        toast.success("Profile updated successfully");
      }
      router.refresh();
    }
  };

  const isPending = form.formState.isSubmitting;

  return (
    <form
      id="profile-update-form"
      onSubmit={form.handleSubmit(onProfileUpdate)}
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="john Doe"
                type="text"
                autoComplete="on"
              />
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="john@example.com"
                type="email"
                autoComplete="on"
              />
            </Field>
          )}
        />
        <Field>
          <Button type="submit" className="w-full" disabled={isPending}>
            Update Profile
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
