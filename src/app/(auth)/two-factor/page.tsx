import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TotpForm } from "@/features/auth/components/totp-form";
import { BackupCodeTab } from "@/features/auth/components/backup-code-tab";
import { requireUnAuth } from "@/lib/auth/auth-check";
import { ShieldCheck } from "lucide-react";

export default async function TwoFactorPage() {
  await requireUnAuth();

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-3 pb-6">
        <div className="flex items-center justify-center">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Verify Your Identity
          </CardTitle>
          <CardDescription className="text-sm">
            Enter your authentication code to continue securely
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="totp" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted p-1 mb-6">
            <TabsTrigger
              value="totp"
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Authenticator
            </TabsTrigger>
            <TabsTrigger
              value="backup"
              className="text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Backup Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="totp" className="space-y-0">
            <TotpForm />
          </TabsContent>

          <TabsContent value="backup" className="space-y-0">
            <BackupCodeTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
