import Link from "next/link";
import { ReactNode, Suspense } from "react";
import { requireAuth } from "@/lib/auth/auth-check";
import {
  ArrowLeft,
  FingerprintIcon,
  Key,
  LinkIcon,
  Loader2Icon,
  Shield,
  Trash2,
  User,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileUpdateForm } from "@/features/user-management/profile/profile-update-form";
import { SecurityTab } from "@/features/user-management/security/security-tab";
import { SessionsTab } from "@/features/user-management/security/session-tab";
import { LinkedAccountsTab } from "@/features/user-management/account/linked-accounts-tab";
import { AccountDeletion } from "@/features/user-management/account/account-deletion";

const page = async () => {
  const session = await requireAuth();

  return (
    <>
      <div className="max-w-4xl mx-auto my-6 px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <ArrowLeft className="size-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-4">
            <div className="rounded-full flex items-center justify-center overflow-hidden">
              <Avatar className="size-16 border-2 border-transparent">
                <AvatarImage
                  src={session?.user.image || ""}
                  alt={session?.user.name || "User"}
                />
                <AvatarFallback className="text-primary text-xl font-semibold">
                  {session?.user.name ? (
                    session?.user.name.charAt(0).toUpperCase()
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex gap-1 justify-between items-start">
                <h1 className="text-3xl font-bold">
                  {session?.user.name || "User Profile"}
                </h1>
                <Badge>User</Badge>
              </div>
              <p className="text-muted-foreground">{session?.user.email}</p>
            </div>
          </div>
        </div>

        <Tabs className="space-y-2" defaultValue="profile">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User />
              <span className="max-sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield />
              <span className="max-sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Key />
              <span className="max-sm:hidden">Sessions</span>
            </TabsTrigger>
            <TabsTrigger value="accounts">
              <LinkIcon />
              <span className="max-sm:hidden">Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="danger">
              <Trash2 />
              <span className="max-sm:hidden">Danger</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">User ID</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-muted p-3">
                    <FingerprintIcon className="h-4 w-4 text-brand" />
                    <code className="text-xs font-mono flex-1 break-all">
                      {session?.user?.id || "Not available"}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is your unique user ID. You may need this for support
                    requests.
                  </p>
                </div>
                <ProfileUpdateForm user={session.user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <LoadingSuspense>
              <SecurityTab
                email={session.user.email}
                // isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
              />
            </LoadingSuspense>
          </TabsContent>

          <TabsContent value="sessions">
            <LoadingSuspense>
              <SessionsTab currentSessionToken={session.session.token} />
            </LoadingSuspense>
          </TabsContent>

          <TabsContent value="accounts">
            <LoadingSuspense>
              <LinkedAccountsTab />
            </LoadingSuspense>
          </TabsContent>

          <TabsContent value="danger">
            <Card className="border border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountDeletion />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;

function LoadingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  );
}
