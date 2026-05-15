"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
          fetchOptions: {
            onError: (error) => {
              toast.error(error.error.message || "Something went wrong");
            },
            onSuccess: () => {
              toast.success("Password reset email sent");
            },
          },
        });
      }}
    >
      Send Password Reset Email
    </Button>
  );
}
