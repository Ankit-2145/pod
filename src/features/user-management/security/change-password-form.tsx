"use client";

import z from "zod";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth/auth-client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
  revokeOtherSessions: z.boolean(),
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const onPasswordChange = async (values: ChangePasswordFormValues) => {
    await authClient.changePassword(values, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to change password");
      },
      onSuccess: () => {
        toast.success("Password changed successfully");
        form.reset();
      },
    });
  };

  const isPending = form.formState.isSubmitting;

  return (
    <FieldSet className="flex flex-col gap-6">
      <form
        id="change-password-form"
        onSubmit={form.handleSubmit(onPasswordChange)}
      >
        <FieldGroup>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="currentPassword"
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="newPassword"
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="revokeOtherSessions"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor={field.name}>
                    Log out other sessions
                  </FieldLabel>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" disabled={isPending} className="w-full">
              Change Password
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FieldSet>
  );
}
