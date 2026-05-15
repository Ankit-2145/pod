"use client";

import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export const LogOutButton = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <button
      className="w-full"
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
    </button>
  );
};
