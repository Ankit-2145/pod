"use client";

import z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const totpSchema = z.object({
  code: z.string().length(6, "Code must be exactly 6 digits"),
});

type TotpFormValues = z.infer<typeof totpSchema>;

export function TotpForm() {
  const router = useRouter();
  const form = useForm<TotpFormValues>({
    resolver: zodResolver(totpSchema),
    defaultValues: {
      code: "",
    },
  });

  const onTotpVerification = async (values: TotpFormValues) => {
    await authClient.twoFactor.verifyTotp(values, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to verify code");
      },
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  const isPending = form.formState.isSubmitting;

  return (
    <form
      id="totp-form"
      className="space-y-5"
      onSubmit={form.handleSubmit(onTotpVerification)}
    >
      <FieldGroup>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Enter 6-Digit Code</FieldLabel>
              <Input
                {...field}
                id="code"
                aria-invalid={fieldState.invalid}
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <>Verifying...</> : "Verify Code"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
