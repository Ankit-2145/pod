"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export const LogOutButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Button
      className="w-full"
      variant="ghost"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/");
            },
          },
        })
      }
    >
      {children}
    </Button>
  );
};
