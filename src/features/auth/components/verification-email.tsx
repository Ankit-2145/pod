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
        <CardTitle className="flex justify-center items-center gap-2">
          <MailCheckIcon className="size-4" />
          Check your email
        </CardTitle>
        <CardDescription className="pt-2">
          If an account exists with the email you entered, we&apos;ve sent a
          verification link. Please check your inbox and follow the instructions
          to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full">
          <Link href="/signup">Try with a different email</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
