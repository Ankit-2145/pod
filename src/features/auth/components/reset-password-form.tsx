"use client";

import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

const ResetPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm() {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onResetPassword = async (values: ResetPasswordFormValues) => {
    await authClient.requestPasswordReset(
      {
        ...values,
        redirectTo: "/new-password",
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Something went wrong");
        },
        onSuccess: () => {
          toast.success("Password reset email sent");
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <FieldSet className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold">Forgot your password?</h1>
        <FieldDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </FieldDescription>
      </div>
      <form
        id="reset-password-form"
        onSubmit={form.handleSubmit(onResetPassword)}
      >
        <FieldGroup>
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
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type="submit" className="w-full" disabled={isPending}>
              Send Email
            </Button>
          </Field>
          <Field>
            <Button
              variant="link"
              className="font-normal w-full text-muted-foreground"
              size="sm"
              asChild
            >
              <Link href="/login">Back to login</Link>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </FieldSet>
  );
}
