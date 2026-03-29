"use client";

import z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { TriangleAlertIcon } from "lucide-react";

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
});

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onNewPassword = async (values: NewPasswordFormValues) => {
    if (token == null) return;
    await authClient.resetPassword(
      {
        newPassword: values.password,
        token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to reset password");
        },
        onSuccess: () => {
          toast.success("Password reset successful");
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  if (token == null || error != null) {
    return (
      <Card className="w-full max-w-md mx-auto my-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TriangleAlertIcon className="size-4" />
            Invalid Reset Link
          </CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired. Please request a
            new one to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <FieldSet className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold">Set a new password</h1>
        <FieldDescription>
          Create a new password to secure your account and log back in.
        </FieldDescription>
      </div>
      <form id="new-password-form" onSubmit={form.handleSubmit(onNewPassword)}>
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                <PasswordInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="********"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" disabled={isPending} className="w-full">
              Reset Password
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FieldSet>
  );
}
