"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authClient } from "@/lib/auth/auth-client";

import { MoreHorizontal } from "lucide-react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { UserWithRole } from "better-auth/plugins/admin";

interface UserActionsProps {
  user: UserWithRole;
  selfId: string;
  currentUserRole: string;
}

export function UserActions({
  user,
  selfId,
  currentUserRole,
}: UserActionsProps) {
  const router = useRouter();

  const { refetch } = authClient.useSession();

  const isSelf = user.id === selfId;

  const isCurrentUserSuperAdmin = currentUserRole === "superAdmin";

  const isTargetSuperAdmin = user.role === "superAdmin";

  if (isSelf) {
    return null;
  }

  // Nobody can manage a super admin
  if (isTargetSuperAdmin) {
    return null;
  }

  function onRoleChange(userId: string, role: "user" | "instructor" | "admin") {
    authClient.admin.setRole(
      {
        userId,
        role,
      },
      {
        onSuccess: () => {
          toast.success("User role updated");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  function onImpersonate(userId: string) {
    authClient.admin.impersonateUser(
      { userId },
      {
        onSuccess: () => {
          refetch();
          router.push("/");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  function onBan(userId: string) {
    authClient.admin.banUser(
      { userId },
      {
        onSuccess: () => {
          toast.success("User banned");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  function onUnban(userId: string) {
    authClient.admin.unbanUser(
      { userId },
      {
        onSuccess: () => {
          toast.success("User unbanned");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  function onRevokeSessions(userId: string) {
    authClient.admin.revokeUserSessions(
      { userId },
      {
        onSuccess: () => {
          toast.success("User sessions revoked");
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  function onDelete(userId: string) {
    authClient.admin.removeUser(
      { userId },
      {
        onSuccess: () => {
          toast.success("User deleted");
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message);
        },
      },
    );
  }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {isCurrentUserSuperAdmin && (
            <>
              <DropdownMenuItem onClick={() => onRoleChange(user.id, "user")}>
                Make User
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onRoleChange(user.id, "instructor")}
              >
                Make Instructor
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onRoleChange(user.id, "admin")}>
                Make Admin
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={() => onImpersonate(user.id)}>
            Impersonate
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onRevokeSessions(user.id)}>
            Revoke Sessions
          </DropdownMenuItem>

          {user.banned ? (
            <DropdownMenuItem onClick={() => onUnban(user.id)}>
              Unban User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onBan(user.id)}>
              Ban User
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem variant="destructive">
              Delete User
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete this user?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={() => onDelete(user.id)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
