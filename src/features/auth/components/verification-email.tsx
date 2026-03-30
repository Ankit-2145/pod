"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheckIcon } from "lucide-react";
import Link from "next/link";

export function EmailVerification() {
  return (
    <Card className="w-full max-w-md mx-auto my-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MailCheckIcon className="size-4" />
          Email Verification
        </CardTitle>
        <CardDescription>
          We sent you a verification link. Please check your email and click the
          link to verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full">
          <Link href="/signup">Back to signup</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
