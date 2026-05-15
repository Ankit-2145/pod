"use client";

import z from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { PasswordInput } from "@/components/ui/password-input";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { QRScanner } from "./QR-scanner";

const twoFactorSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

type TwoFactorValues = {
  totpURI: string;
  backupCodes: string[];
};

export function TwoFactor({ isEnabled }: { isEnabled: boolean }) {
  const [twoFactorValue, setTwoFactorValue] = useState<TwoFactorValues | null>(
    null,
  );

  const router = useRouter();

  const form = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { password: "" },
  });

  const onDisableTwoFactor = async (values: TwoFactorFormValues) => {
    await authClient.twoFactor.disable(
      {
        password: values.password,
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message ||
              "Failed to disable Two-Factor Authentication",
          );
        },
        onSuccess: () => {
          form.reset();
          router.refresh();
          toast.success("Two-Factor Authentication disabled");
        },
      },
    );
  };

  const onEnableTwoFactor = async (values: TwoFactorFormValues) => {
    const result = await authClient.twoFactor.enable({
      password: values.password,
    });

    if (result.error) {
      toast.error(
        result.error.message || "Failed to enable Two-Factor Authentication",
      );
    }
    {
      setTwoFactorValue(result.data);
      form.reset();
      toast.success("Two-Factor Authentication enabled");
    }
  };

  const isPending = form.formState.isSubmitting;

  if (twoFactorValue != null) {
    return (
      <QRScanner
        {...twoFactorValue}
        onDone={() => {
          setTwoFactorValue(null);
        }}
      />
    );
  }

  return (
    <form
      id="two-factor-form"
      className="space-y-4"
      onSubmit={form.handleSubmit(
        isEnabled ? onDisableTwoFactor : onEnableTwoFactor,
      )}
    >
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
              <PasswordInput
                {...field}
                id="password"
                aria-invalid={fieldState.invalid}
                placeholder="********"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
            variant={isEnabled ? "destructive" : "default"}
          >
            {isEnabled ? "Disable Two-Factor" : "Enable Two-Factor"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
