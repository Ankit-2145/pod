"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const backupCodeSchema = z.object({
  code: z.string().min(1, "Backup code is required"),
});

type BackupCodeForm = z.infer<typeof backupCodeSchema>;

export function BackupCodeTab() {
  const router = useRouter();
  const form = useForm<BackupCodeForm>({
    resolver: zodResolver(backupCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleBackupCodeVerification(data: BackupCodeForm) {
    await authClient.twoFactor.verifyBackupCode(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to verify code");
      },
      onSuccess: () => {
        router.push("/");
      },
    });
  }

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(handleBackupCodeVerification)}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium">
                Enter Backup Code
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter your backup code"
                  className="font-mono text-sm"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 font-medium"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>
      </form>
    </Form>
  );
}
