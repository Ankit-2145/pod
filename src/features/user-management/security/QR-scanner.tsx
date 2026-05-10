import z from "zod";
import { useState } from "react";
import { toast } from "sonner";

import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const QRScannerSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

type QRScannerFormValues = z.infer<typeof QRScannerSchema>;

type TwoFactorValues = {
  totpURI: string;
  backupCodes: string[];
};

export function QRScanner({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorValues & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);

  const router = useRouter();

  const form = useForm<QRScannerFormValues>({
    resolver: zodResolver(QRScannerSchema),
    defaultValues: { code: "" },
  });

  const onScanQRCode = async (values: QRScannerFormValues) => {
    await authClient.twoFactor.verifyTotp(
      {
        code: values.code,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to verify code");
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true);
          router.refresh();
          toast.success("Code verified successfully");
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm">
              {code}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </>
    );
  }

  return (
    <FieldSet className="space-y-4">
      <FieldDescription className="text-muted-foreground">
        Scan this QR code with your authenticator app and enter the code below:
      </FieldDescription>

      <form
        id="two-factor-QR-form"
        className="space-y-4"
        onSubmit={form.handleSubmit(onScanQRCode)}
      >
        <FieldGroup>
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Code</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="123456"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button type="submit" disabled={isPending} className="w-full">
              Submit Code
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <div className="p-4 bg-white w-fit">
        <QRCode size={256} value={totpURI} />
      </div>
    </FieldSet>
  );
}
